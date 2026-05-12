import * as React from "react";
import { cn } from "../ui/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLNavElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLNavElement, BreadcrumbProps>(
  ({
    items,
    separator = (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mx-1">
        <path
          d="M6 12L10 8L6 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    className,
    ...props
  }, ref) => (
    <nav
      ref={ref}
      className={cn("flex items-center text-sm", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center gap-0">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-0">
            {item.href ? (
              <a
                href={item.href}
                className={cn(
                  "transition-colors",
                  item.isActive
                    ? "text-foreground font-medium cursor-default"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                disabled={item.isActive}
                className={cn(
                  "transition-colors text-left",
                  item.isActive
                    ? "text-foreground font-medium cursor-default"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            )}

            {index < items.length - 1 && (
              <span className="text-muted-foreground" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
