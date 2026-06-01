interface AdminPanelProps {
  title?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function AdminPanel({ title, label, children, className = '', actions }: AdminPanelProps) {
  return (
    <div className={`editorial-panel p-6 md:p-8 ${className}`}>
      {(title || label || actions) && (
        <div className="flex items-end justify-between gap-4 mb-6 pb-6 border-b border-th-fg/8">
          <div className="page-heading-stack">
            {label ? <span className="section-label">{label}</span> : null}
            {title ? <h2 className="heading-section text-xl">{title}</h2> : null}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
