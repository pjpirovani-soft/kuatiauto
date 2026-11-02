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
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

const TEXT_COLOR: Record<LogoTheme, string> = {
  light: 'text-kuati-petroleo',
  dark: 'text-kuati-blanco',
};

const HORIZONTAL_SRC: Record<LogoTheme, string> = {
  light: '/branding/logo-horizontal.webp',
  dark: '/branding/logo-horizontal-blanco.webp',
};

const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  hero: 'h-24 md:h-32',
};

function LogoContent({
  variant = 'horizontal',
  theme = 'light',
  showText,
  priority = false,
  className = '',
  size = 'md',
}: Omit<LogoProps, 'href'>) {
  const isHorizontal = variant === 'horizontal';
  const shouldShowText = showText ?? isHorizontal;

  if (isHorizontal) {
    const sizeClass = SIZE_CLASSES[size];
    return (
      <Image
        src={HORIZONTAL_SRC[theme]}
        alt="KuatiAuto"
        width={400}
        height={100}
        priority={priority}
        className={['w-auto', sizeClass, className].filter(Boolean).join(' ')}
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
        <span className={['text-xl font-bold tracking-wide', TEXT_COLOR[theme]].join(' ')}>
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

