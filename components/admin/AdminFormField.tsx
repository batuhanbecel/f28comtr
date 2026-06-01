interface AdminFormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormField({ label, children, className = '' }: AdminFormFieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="admin-input" {...props} />;
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="admin-input min-h-[100px] resize-y" {...props} />;
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="admin-input" {...props} />;
}
