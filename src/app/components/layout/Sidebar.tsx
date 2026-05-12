import * as React from "react";
import { cn } from "../ui/utils";

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: string | number;
  submenu?: SidebarItem[];
  active?: boolean;
  disabled?: boolean;
}

export interface SidebarProps
  extends React.HTMLAttributes<HTMLAsideElement> {
  items: SidebarItem[];
  logo?: React.ReactNode;
  logoText?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  footer?: React.ReactNode;
  onItemClick?: (item: SidebarItem) => void;
}

const Sidebar = React.forwardRef<HTMLAsideElement, SidebarProps>(
  ({
    items,
    logo,
    logoText,
    collapsible = true,
    defaultCollapsed = false,
    footer,
    onItemClick,
    className,
    ...props
  }, ref) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

    const toggleSubmenu = (itemId: string) => {
      setExpandedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    };

    const renderItem = (item: SidebarItem, depth = 0) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isExpanded = expandedItems.includes(item.id);

      return (
        <div key={item.id}>
          <button
            onClick={() => {
              onItemClick?.(item);
              if (hasSubmenu) toggleSubmenu(item.id);
            }}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed",
              item.active && "bg-sidebar-primary text-sidebar-primary-foreground",
              depth > 0 && "ml-4"
            )}
          >
            {item.icon && <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>}
            {!collapsed && (
              <>
                <span className="flex-grow text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {hasSubmenu && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={cn(
                      "transition-transform flex-shrink-0",
                      isExpanded && "rotate-180"
                    )}
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </>
            )}
          </button>

          {hasSubmenu && isExpanded && !collapsed && (
            <div className="mt-1 space-y-1">
              {item.submenu!.map((subitem) => renderItem(subitem, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <aside
        ref={ref}
        className={cn(
          "h-screen border-r border-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          className
        )}
        {...props}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center justify-between px-4 py-3 border-b border-sidebar-border",
          collapsed && "justify-center"
        )}>
          {logo && <span className="flex-shrink-0 w-6 h-6">{logo}</span>}
          {!collapsed && logoText && <span className="font-semibold">{logoText}</span>}
          {collapsible && (
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-sidebar-accent rounded transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow overflow-y-auto p-2 space-y-1">
          {items.map((item) => renderItem(item))}
        </nav>

        {/* Footer */}
        {footer && (
          <div className="border-t border-sidebar-border p-4">
            {footer}
          </div>
        )}
      </aside>
    );
  }
);

Sidebar.displayName = "Sidebar";

export { Sidebar };
export type { SidebarItem, SidebarProps };
