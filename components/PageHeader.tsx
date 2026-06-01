interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  variant?: 'default' | 'hero';
  shell?: boolean;
  preline?: boolean;
  gradient?: boolean;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function PageHeader({
  label,
  title,
  description,
  align = 'center',
  variant = 'default',
  shell = true,
  preline = false,
  gradient = true,
  children,
  actions,
  className = '',
  animate = true,
}: PageHeaderProps) {
  const center = align === 'center';
  const anim = animate ? 'fade-in-up' : '';
  const shellClass = variant === 'hero' && shell ? 'page-hero-shell hero-screen' : '';
  const headerBlock = variant === 'default' ? 'page-header-block' : '';

  return (
    <header className={`${shellClass} ${headerBlock} max-w-5xl w-full ${center ? 'mx-auto text-center' : 'text-left'} ${className}`}>
      <div className={`page-heading-stack ${center ? 'page-heading-stack--center' : ''}`}>
        <div className={`hero-rule ${anim} ${center ? '' : 'hero-rule--left'}`} style={animate ? { animationDelay: '0.05s' } : undefined} />
        {label ? (
          <span className={`section-label section-label--pill ${anim}`} style={animate ? { animationDelay: '0.1s' } : undefined}>
            {label}
          </span>
        ) : null}
        <h1
          className={`heading-hero ${gradient ? 'gradient-text' : ''} ${anim}`}
          style={{
            animationDelay: animate ? '0.2s' : undefined,
            whiteSpace: preline ? 'pre-line' : undefined,
          }}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={`body-text max-w-2xl opacity-60 leading-relaxed ${anim} ${center ? 'mx-auto' : ''}`}
            style={animate ? { animationDelay: '0.25s' } : undefined}
          >
            {description}
          </p>
        ) : null}
        {children ? (
          <div className={anim} style={animate ? { animationDelay: '0.3s' } : undefined}>
            {children}
          </div>
        ) : null}
      </div>
      {actions ? <div className="mt-8 flex justify-end">{actions}</div> : null}
    </header>
  );
}

interface SectionHeaderProps {
  label?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ label, title, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between gap-6 mb-8 ${className}`}>
      <div className="page-heading-stack gap-3">
        {label ? <span className="section-label">{label}</span> : null}
        <h2 className="heading-section">{title}</h2>
      </div>
      {action}
    </div>
  );
}
