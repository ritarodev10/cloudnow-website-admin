import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageTitle({
  title,
  description,
  children,
  actions,
  className = "",
}: PageTitleProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
