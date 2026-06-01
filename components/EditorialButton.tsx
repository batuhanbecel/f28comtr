import Link from 'next/link';

type Variant = 'default' | 'light' | 'primary' | 'ghost';

interface EditorialButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const variantClass: Record<Variant, string> = {
  default: '',
  light: 'btn-editorial--light',
  primary: 'btn-editorial--primary',
  ghost: '!border-transparent !bg-transparent opacity-70 hover:opacity-100',
};

export function EditorialButton({
  children,
  href,
  onClick,
  variant = 'default',
  className = '',
  type = 'button',
  disabled,
}: EditorialButtonProps) {
  const cls = `btn-editorial ${variantClass[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
