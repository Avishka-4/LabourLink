import * as React from "react";
import { cn } from "../ui/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "outline" | "elevated" | "flat";
    hoverable?: boolean;
  }
>(({ className, variant = "default", hoverable = false, ...props }, ref) => {
  const variantStyles = {
    default: "bg-card border border-border rounded-lg shadow-sm",
    outline: "bg-background border-2 border-border rounded-lg",
    elevated: "bg-card border-0 rounded-lg shadow-md",
    flat: "bg-card border-0 rounded-lg",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col",
        variantStyles[variant],
        hoverable && "transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-border", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: "row" | "column";
  }
>(({ className, direction = "row", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex p-6 border-t border-border",
      direction === "row" ? "flex-row justify-end gap-2" : "flex-col gap-3",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
