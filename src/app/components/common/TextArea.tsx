import * as React from "react";
import { cn } from "../ui/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCounter?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    className,
    label,
    error,
    hint,
    maxLength,
    showCounter = false,
    value,
    disabled,
    ...props
  }, ref) => {
    const currentLength = String(value).length;

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

        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm transition-colors resize-none",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive/50",
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
          {...props}
        />

        <div className="flex items-center justify-between gap-2 text-xs">
          <div>
            {error && <p id={`${props.id}-error`} className="text-destructive">{error}</p>}
            {hint && !error && <p id={`${props.id}-hint`} className="text-muted-foreground">{hint}</p>}
          </div>
          {showCounter && maxLength && (
            <p className={cn(
              "text-muted-foreground",
              currentLength > maxLength * 0.9 && "text-yellow-600",
              currentLength >= maxLength && "text-destructive"
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
