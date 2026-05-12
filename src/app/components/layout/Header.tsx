import * as React from "react";
import { cn } from "../ui/utils";
import { Button } from "../common/Button";

export interface HeaderProps
  extends React.HTMLAttributes<HTMLHeaderElement> {
  logo?: React.ReactNode;
  logoText?: string;
  logoHref?: string;
  navItems?: {
    label: string;
    href: string;
    onClick?: () => void;
  }[];
  userMenu?: {
    name: string;
    email?: string;
    avatar?: string;
    items: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
      divider?: boolean;
    }[];
  };
  searchable?: boolean;
  onSearch?: (query: string) => void;
  rightActions?: React.ReactNode;
  sticky?: boolean;
}

const Header = React.forwardRef<HTMLHeaderElement, HeaderProps>(
  ({
    logo,
    logoText,
    logoHref = "/",
    navItems = [],
    userMenu,
    searchable = false,
    onSearch,
    rightActions,
    sticky = true,
    className,
    ...props
  }, ref) => {
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    return (
      <header
        ref={ref}
        className={cn(
          "border-b border-border bg-background/80 backdrop-blur-sm z-40",
          sticky && "sticky top-0",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          {/* Logo */}
          <a href={logoHref} className="flex items-center gap-2 font-semibold text-lg">
            {logo}
            {logoText}
          </a>

          {/* Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                >
                  <a href={item.href}>{item.label}</a>
                </button>
              ))}
            </nav>
          )}

          {/* Search and Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {searchable && (
              <div className="relative hidden sm:block">
                {searchOpen ? (
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      onSearch?.(e.target.value);
                    }}
                    onBlur={() => setSearchOpen(false)}
                    autoFocus
                    className="h-9 px-3 rounded-md border border-input bg-input-background text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="p-2 hover:bg-accent rounded-md transition-colors"
                    aria-label="Search"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {rightActions}

            {/* User Menu */}
            {userMenu && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-accent rounded-md transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  {userMenu.avatar && (
                    <img
                      src={userMenu.avatar}
                      alt={userMenu.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="hidden sm:inline text-sm font-medium">{userMenu.name}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg">
                    {userMenu.email && (
                      <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">
                        {userMenu.email}
                      </div>
                    )}
                    <div className="py-1">
                      {userMenu.items.map((item, index) => (
                        <React.Fragment key={index}>
                          {item.divider && (
                            <div className="my-1 border-t border-border" />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              item.onClick();
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 transition-colors"
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";

export { Header };
