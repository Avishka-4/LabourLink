import * as React from "react";
import { cn } from "../ui/utils";
import { Header, type HeaderProps } from "./Header";
import { Sidebar, type SidebarProps } from "./Sidebar";
import { Footer, type FooterProps } from "./Footer";

export interface MainLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  header?: HeaderProps & { enabled?: boolean };
  sidebar?: SidebarProps & { enabled?: boolean };
  footer?: FooterProps & { enabled?: boolean };
  children: React.ReactNode;
  showHeaderOnly?: boolean;
  headerHeight?: string;
}

const MainLayout = React.forwardRef<HTMLDivElement, MainLayoutProps>(
  ({
    header,
    sidebar,
    footer,
    children,
    showHeaderOnly = false,
    headerHeight = "h-14",
    className,
    ...props
  }, ref) => {
    const showHeader = header?.enabled !== false;
    const showSidebar = sidebar?.enabled !== false && !showHeaderOnly;
    const showFooter = footer?.enabled !== false;

    const headerProps = header || {};
    const sidebarProps = sidebar || {};
    const footerProps = footer || {};

    // Remove 'enabled' prop before spreading
    const { enabled: _headerEnabled, ...cleanHeaderProps } = headerProps;
    const { enabled: _sidebarEnabled, ...cleanSidebarProps } = sidebarProps;
    const { enabled: _footerEnabled, ...cleanFooterProps } = footerProps;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col min-h-screen bg-background", className)}
        {...props}
      >
        {/* Header */}
        {showHeader && <Header {...cleanHeaderProps} />}

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Sidebar */}
          {showSidebar && <Sidebar {...cleanSidebarProps} />}

          {/* Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>

        {/* Footer */}
        {showFooter && <Footer {...cleanFooterProps} />}
      </div>
    );
  }
);

MainLayout.displayName = "MainLayout";

export { MainLayout };
export type { MainLayoutProps };
