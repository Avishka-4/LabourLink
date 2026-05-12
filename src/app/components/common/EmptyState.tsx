import * as React from "react";
import { cn } from "../ui/utils";

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({
    icon,
    title,
    description,
    action,
    className,
    ...props
  }, ref) => {
    const defaultIcon = (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="text-muted-foreground"
      >
        <rect x="6" y="6" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="18" r="2" fill="currentColor" />
        <path d="M6 30L16 20L28 32L42 18V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-center">
          {icon || defaultIcon}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
