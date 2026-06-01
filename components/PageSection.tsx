interface PageSectionProps {
  children: React.ReactNode;
  border?: boolean;
  className?: string;
  id?: string;
}

export function PageSection({ children, border = false, className = '', id }: PageSectionProps) {
  return (
    <section
      id={id}
      className={`page-section max-w-7xl mx-auto w-full ${border ? 'page-section--border' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
