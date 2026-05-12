import * as React from "react";
import { cn } from "../ui/utils";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  multiSelect?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  icon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    label,
    placeholder = "Select an option",
    options,
    value,
    onChange,
    error,
    hint,
    disabled = false,
    multiSelect = false,
    searchable = false,
    clearable = false,
    icon,
    className,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedValues, setSelectedValues] = React.useState<(string | number)[]>(
      multiSelect && Array.isArray(value) ? value : value ? [value] : []
    );
    const containerRef = React.useRef<HTMLDivElement>(null);

    const filteredOptions = React.useMemo(() => {
      if (!searchable) return options;
      return options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm, searchable]);

    const getSelectedLabel = () => {
      if (selectedValues.length === 0) return placeholder;
      if (multiSelect) {
        return `${selectedValues.length} selected`;
      }
      const selected = options.find(opt => opt.value === selectedValues[0]);
      return selected?.label || placeholder;
    };

    const handleSelect = (optionValue: string | number) => {
      let newValues;
      if (multiSelect) {
        newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter(v => v !== optionValue)
          : [...selectedValues, optionValue];
      } else {
        newValues = [optionValue];
        setIsOpen(false);
      }
      setSelectedValues(newValues);
      onChange?.(multiSelect ? newValues : newValues[0]);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValues([]);
      onChange?.(multiSelect ? [] : "");
    };

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="flex flex-col gap-1.5 w-full" {...props}>
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        <div
          ref={containerRef}
          className={cn(
            "relative w-full"
          )}
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-md border border-input bg-input-background px-3 py-2 text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-destructive focus:ring-destructive/50",
              isOpen && "ring-2 ring-primary/50 border-primary"
            )}
          >
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-foreground truncate">{getSelectedLabel()}</span>
            </div>
            <div className="flex items-center gap-1">
              {clearable && selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 hover:bg-muted rounded transition-colors"
                  aria-label="Clear selection"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={cn(
                  "transition-transform",
                  isOpen && "rotate-180"
                )}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-input bg-card shadow-md">
              {searchable && (
                <div className="p-2 border-b border-input">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-8 px-2 rounded text-sm border border-input bg-input-background focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
              )}
              <div className="max-h-64 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No options</div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors",
                        "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
                        selectedValues.includes(option.value) && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {multiSelect && (
                          <input
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            readOnly
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
