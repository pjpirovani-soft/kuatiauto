import Image from 'next/image';
import Link from 'next/link';

type LogoVariant = 'horizontal' | 'isotipo';
type LogoTheme = 'light' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  showText?: boolean;
  href?: string;
  className?: string;
  priority?: boolean;
}

const TEXT_COLOR: Record<LogoTheme, string> = {
  light: 'text-kuati-petroleo',
  dark: 'text-kuati-blanco',
};

function LogoContent({
  variant = 'horizontal',
  theme = 'light',
  showText,
  priority = false,
  className = '',
}: Omit<LogoProps, 'href'>) {
  const isHorizontal = variant === 'horizontal';
  const shouldShowText = showText ?? isHorizontal;

  if (isHorizontal) {
    return (
      <Image
        src="/branding/logo-horizontal.webp"
        alt="KuatiAuto"
        width={160}
        height={40}
        priority={priority}
        className={['h-9 w-auto', className].filter(Boolean).join(' ')}
      />
    );
  }

  return (
    <span className={['inline-flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <Image
        src="/branding/isotipo.png"
        alt="KuatiAuto"
        width={40}
        height={40}
        priority={priority}
        className="h-10 w-10"
      />
      {shouldShowText && (
        <span
          className={[
            'text-xl font-bold tracking-wide',
            TEXT_COLOR[theme],
          ].join(' ')}
        >
          KuatiAuto
        </span>
      )}
    </span>
  );
}

export default function Logo({ href, ...props }: LogoProps) {
  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        <LogoContent {...props} />
      </Link>
    );
  }
  return <LogoContent {...props} />;
}
