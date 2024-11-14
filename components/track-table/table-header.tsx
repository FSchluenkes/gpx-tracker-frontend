import { cn } from "@/lib/utils";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHeader = ({ children, className, ...props }: TableHeaderProps) => {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-2 text-left text-sm font-medium text-foreground dark:text-foreground tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

TableHeader.displayName = "TableHeader";

export { TableHeader, type TableHeaderProps };
