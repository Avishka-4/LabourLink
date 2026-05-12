import * as React from "react";
import { cn } from "../ui/utils";
import { Button } from "../common/Button";
import { Checkbox } from "../common/Checkbox";

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: "primary" | "outline" | "danger";
  condition?: (row: T) => boolean;
}

export interface GenericTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  actions?: TableAction<T>[];
  onSelectRow?: (row: T, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  selectedRows?: (string | number)[];
  loading?: boolean;
  sortable?: boolean;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
}

function GenericTable<T = any>(
  {
    columns,
    data,
    keyExtractor,
    actions = [],
    onSelectRow,
    onSelectAll,
    selectedRows = [],
    loading = false,
    sortable = true,
    rowClassName,
    onRowClick,
    striped = true,
    hoverable = true,
  }: GenericTableProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnKey) {
        if (current.direction === "asc") {
          return { key: columnKey, direction: "desc" };
        } else {
          return null;
        }
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  const getSortedData = () => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const sortedData = getSortedData();

  return (
    <div ref={ref} className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 [&_th]:p-3 [&_th]:text-left [&_th]:font-medium [&_th]:text-foreground">
            {onSelectRow && (
              <th className="w-12">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={(checked) => {
                    onSelectAll?.(!!checked);
                  }}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width }}>
                {column.sortable && sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {column.label}
                    {sortConfig?.key === column.key && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={cn(
                          "transition-transform",
                          sortConfig.direction === "desc" && "rotate-180"
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
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>

        <tbody className="[&_td]:p-3 [&_td]:text-foreground">
          {loading ? (
            <tr>
              <td colSpan={columns.length + (onSelectRow ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                  </svg>
                  Loading...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onSelectRow ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => {
              const rowKey = keyExtractor(row, index);
              const isSelected = selectedRows.includes(rowKey);

              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border transition-colors",
                    striped && index % 2 === 1 && "bg-muted/30",
                    hoverable && "hover:bg-accent/50",
                    onRowClick && "cursor-pointer",
                    rowClassName?.(row)
                  )}
                >
                  {onSelectRow && (
                    <td>
                      <Checkbox
                        id={`row-${rowKey}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          onSelectRow(row, !!checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(row[column.key as keyof T], row) : String(row[column.key as keyof T] || "-")}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td>
                      <div className="flex gap-1">
                        {actions
                          .filter((action) => !action.condition || action.condition(row))
                          .slice(0, 2)
                          .map((action) => (
                            <Button
                              key={action.label}
                              variant={action.variant || "outline"}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              title={action.label}
                            >
                              {action.icon}
                              {!action.icon && action.label}
                            </Button>
                          ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

const GenericTableRef = React.forwardRef(GenericTable) as <T = any>(
  props: GenericTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => JSX.Element;

GenericTableRef.displayName = "GenericTable";

export { GenericTableRef as GenericTable };
