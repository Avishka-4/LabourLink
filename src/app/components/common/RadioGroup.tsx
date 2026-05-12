import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../ui/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  label?: string;
  options: RadioOption[];
  error?: string;
  hint?: string;
  required?: boolean;
  layout?: "vertical" | "horizontal";
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  ({
    label,
    options,
    error,
    hint,
    required,
    layout = "vertical",
    className,
    ...props
  }, ref) => (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn(
          "flex gap-3",
          layout === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-2">
            <RadioGroupPrimitive.Item
              value={option.value}
              disabled={option.disabled}
              id={`radio-${option.value}`}
              className={cn(
                "h-4 w-4 rounded-full border-2 border-primary ring-offset-background transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-destructive"
              )}
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>

            <div className="flex flex-col gap-0.5">
              <label
                htmlFor={`radio-${option.value}`}
                className="text-sm font-medium cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroupPrimitive.Root>

      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
