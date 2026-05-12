import * as React from "react";
import { cn } from "../ui/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    label,
    error,
    hint,
    icon,
    iconPosition = "left",
    clearable = false,
    onClear,
    value,
    disabled,
    ...props
  }, ref) => {
    const [showClearIcon, setShowClearIcon] = React.useState(false);

    React.useEffect(() => {
      setShowClearIcon(clearable && !!value && !disabled);
    }, [value, clearable, disabled]);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 flex items-center justify-center text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive/50",
              icon && iconPosition === "left" && "pl-10",
              (icon || showClearIcon) && iconPosition === "right" && "pr-10",
              className
            )}
            ref={ref}
            value={value}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
            {...props}
          />

          {showClearIcon && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear input"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M5.5 10.5L10.5 5.5M10.5 10.5L5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {icon && iconPosition === "right" && !showClearIcon && (
            <div className="absolute right-3 flex items-center justify-center text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${props.id}-error`} className="text-xs text-destructive">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${props.id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
