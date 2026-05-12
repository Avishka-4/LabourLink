import * as React from "react";
import { cn } from "../ui/utils";

export interface FooterLink {
  label: string;
  href: string;
  onClick?: () => void;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps
  extends React.HTMLAttributes<HTMLFooterElement> {
  columns?: FooterColumn[];
  copyright?: string;
  copyrightYear?: number | string;
  companyName?: string;
  socialLinks?: {
    icon: React.ReactNode;
    href: string;
    label: string;
  }[];
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

const Footer = React.forwardRef<HTMLFooterElement, FooterProps>(
  ({
    columns = [],
    copyright,
    copyrightYear,
    companyName,
    socialLinks = [],
    contactInfo,
    className,
    ...props
  }, ref) => {
    const year = copyrightYear || new Date().getFullYear();

    const defaultCopyright = copyright || `© ${year} ${companyName || "Company"}. All rights reserved.`;

    return (
      <footer
        ref={ref}
        className={cn("border-t border-border bg-muted/50", className)}
        {...props}
      >
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company Info Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{companyName}</h3>

              {contactInfo && (
                <div className="space-y-2 text-sm text-muted-foreground">
                  {contactInfo.email && (
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  )}
                  {contactInfo.phone && (
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="block hover:text-foreground transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  )}
                  {contactInfo.address && (
                    <p>{contactInfo.address}</p>
                  )}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="flex gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      aria-label={link.label}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Link Columns */}
            {columns.map((column, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        onClick={link.onClick}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {defaultCopyright}
            </p>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = "Footer";

export { Footer };
export type { FooterProps, FooterColumn, FooterLink };
