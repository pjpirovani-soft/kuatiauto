import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    rules: {
      // Deuda: reemplazar `any` por tipos reales de a uno. Mientras tanto, warn.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Deuda: limpiar imports/vars sin usar. Mientras tanto, warn.
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      // Deuda: refactor pendiente de 4 useEffect que derivan estado con setState sincronico
      // (React 19 lo rechaza). Archivos: components/directorio/MapaDirectorio.tsx,
      // components/MobileSidebarWrapper.tsx, components/OrdenForm.tsx, components/RegistroSW.tsx.
      // Reemplazar por useMemo/useSyncExternalStore en sesion dedicada.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);

export default eslintConfig;