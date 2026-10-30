# Encoding y Line Endings — kuatiauto

## El problema

En Windows + PowerShell 5.1, los archivos de texto pueden corromperse de 4 formas. Este documento es para no repetirlas.

### 1. BOM (Byte Order Mark)

- Que es: 3 bytes `EF BB BF` al inicio del archivo. Invisibles en VS Code, rompen scripts y comparaciones.
- Como se ve: `ï»¿` al inicio (leido como CP1252), o invisible.
- Causa: `Set-Content`, `Out-File`, `>` sin `-Encoding utf8NoBOM`. PowerShell 5.1 agrega BOM por defecto.
- Solucion: SIEMPRE usar `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))`.

### 2. Mojibake (UTF-8 leido como CP850/CP1252)

- Que es: un archivo UTF-8 se lee como si fuera ANSI, y los acentos se rompen.
- Como se ve: `sesion` → `sesi├│n`, `—` → `â€"`, `ó` → `Ã³`, `ñ` → `Ã±`.
- Causa: `Get-Content` sin `-Encoding UTF8` en PowerShell 5.1.
- Solucion: SIEMPRE `Get-Content -Encoding UTF8`. Si el archivo en disco esta bien pero la consola lo muestra mal, es solo visualizacion — verificar con `ReadAllBytes` + `UTF8.GetString`.

### 3. CRLF vs LF (line endings)

- Que es: Windows usa `CRLF` (`\r\n`), Linux/Mac usan `LF` (`\n`).
- Como se ve: `git diff` muestra el archivo entero cambiado aunque solo cambiaste una linea. `Replace` falla.
- Causa: editar en Windows sin normalizar, o `git add` sin `.gitattributes`.
- Solucion: `.gitattributes` con `* text=auto eol=lf` y `*.ps1 text eol=lf`. Normalizar con `-replace "\r\n","\n"`. Verificar con `git ls-files --eol <archivo>` (debe decir `i/lf`).

### 4. Replacement Character (U+FFFD)

- Que es: el caracter `�` que aparece cuando un byte no se puede decodificar.
- Como se ve: `�` en lugar de un caracter.
- Causa: el archivo tiene bytes invalidos para UTF-8, o esta en otra encoding.
- Solucion: verificar con `ReadAllBytes` + `UTF8.GetString`. Si no decodifica limpio, reescribir el archivo completo (no parchear).
## Comandos PROHIBIDOS

- `Set-Content -Path X -Value Y` (agrega BOM en PS 5.1)
- `Out-File -FilePath X` (agrega BOM)
- `X > archivo.txt` (agrega BOM)
- `Get-Content X` sin `-Encoding UTF8` (lee como ANSI, muestra mojibake)
- `[System.IO.File]::WriteAllText($p, $c)` sin `UTF8Encoding($false)` (agrega BOM)
- Editar con `Copy-Item` o `Move-Item` sin verificar line endings

## Comandos PERMITIDOS

- `[System.IO.File]::WriteAllText($path, ($content -replace "\r\n","\n"), [System.Text.UTF8Encoding]::new($false))`
- `Get-Content $path -Raw -Encoding UTF8`
- `[System.IO.File]::ReadAllText($path, [System.Text.UTF8Encoding]::new($false))`
- `[System.IO.File]::ReadAllBytes($path)` + `[System.Text.Encoding]::UTF8.GetString($bytes)`
- `git ls-files --eol <archivo>`

## Verificacion obligatoria antes de commit

Para cada archivo modificado:

1. BOM: primeros 3 bytes NO son `EF BB BF`.
2. Line endings: `CRLF=0 LF=N` (LF puro).
3. Encoding: `ReadAllText` con `UTF8Encoding($false)` no tira excepcion.
## Funcion de verificacion

function Test-EncodingFile {
  param([string]$Path)
  $bytes = [System.IO.File]::ReadAllBytes($Path)
  $hasBom = ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
  $text = [System.Text.Encoding]::UTF8.GetString($bytes)
  $crlf = ([regex]::Matches($text, "`r`n")).Count
  $lf = ([regex]::Matches($text, "`n")).Count
  [PSCustomObject]@{
    Path = $Path
    BOM = $hasBom
    CRLF = $crlf
    LF = $lf
    OK = (-not $hasBom) -and ($crlf -eq 0) -and ($lf -gt 0)
  }
}

## Regla para la IA

- Antes de escribir: verificar que usas WriteAllText con UTF8Encoding(false). Si no, no escribas.
- Antes de leer: verificar que usas -Encoding UTF8 o ReadAllText con UTF8Encoding(false). Si no, no leas.
- Antes de commitear: correr Test-EncodingFile sobre los archivos modificados.
- Si ves caracteres raros en output, NO es el archivo - es la consola. Verificar con ReadAllBytes.
- Comandos largos: partir en bloques de menos de 40 lineas. Cada here-string debe abrir y cerrar en el mismo bloque. Si se corta, Ctrl+C y reintentar en partes mas chicas.