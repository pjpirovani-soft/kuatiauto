import Link from 'next/link';
import { IconChevronRight, IconHome } from '@tabler/icons-react';

type Props = {
  items: { label: string; href?: string }[];
};

export default function AyudaBreadcrumb({ items }: Props) {
  return (
    <nav aria-label='Breadcrumb' className='flex items-center gap-1 text-sm text-kuati-grafito/60 flex-wrap'>
      <Link href='/ayuda' className='inline-flex items-center gap-1 hover:text-kuati-petroleo transition-colors'>
        <IconHome size={14} />
        Ayuda
      </Link>
      {items.map((item, i) => (
        <span key={i} className='inline-flex items-center gap-1'>
          <IconChevronRight size={14} className='text-kuati-grafito/40' />
          {item.href ? (
            <Link href={item.href} className='hover:text-kuati-petroleo transition-colors'>
              {item.label}
            </Link>
          ) : (
            <span className='text-kuati-grafito'>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}