import { cn } from "@/lib/utils";
import { DetailedHTMLProps, TdHTMLAttributes } from "react";

interface TableDataProps
  extends DetailedHTMLProps<
    TdHTMLAttributes<HTMLTableDataCellElement>,
    HTMLTableDataCellElement
  > {
  children: React.ReactNode;
}

const TableData = ({ children, className, ...props }: TableDataProps) => {
  return (
    <td
      className={cn(
        "px-4 py-2 text-left text-sm font-medium text-foreground dark:text-foreground tracking-wider first:rounded-l-lg last:rounded-r-lg",
        className ? className : "group-hover:bg-muted group-hover:dark:bg-muted"
      )}
      {...props}
    >
      {children}
    </td>
  );
};

TableData.displayName = "TableData";

export { TableData, type TableDataProps };
