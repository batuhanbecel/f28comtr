interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
}

export function AdminButton({ variant = 'ghost', children, className = '', type = 'button', ...props }: AdminButtonProps) {
  const v = variant === 'primary' ? 'btn-editorial--primary' : '';
  return (
    <button type={type} className={`btn-editorial text-[10px] ${v} ${className}`} {...props}>
      {children}
    </button>
  );
}
