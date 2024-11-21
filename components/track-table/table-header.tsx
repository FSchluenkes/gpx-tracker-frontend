import { cn } from "@/lib/utils";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHeader = ({ children, className, ...props }: TableHeaderProps) => {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-2 text-left text-sm font-medium text-forgound dark:text-foreground tracking-wider bg-muted dark:bg-muted first:rounded-l-lg last:rounded-r-lg",
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
