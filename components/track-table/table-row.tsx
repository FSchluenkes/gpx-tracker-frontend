import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { TableData } from "./table-data";
import { Track } from "@/lib/types";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  track: Track;
  selected?: boolean;
}

const TableRow = ({
  track,
  selected = false,
  className,
  ...props
}: TableRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    if (ref.current && selected) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);
  return (
    <tr
      className={cn("bg-background dark:bg-background group", className)}
      ref={ref}
      {...props}
    >
      <TableData className={selected ? "bg-primary dark:bg-primary" : ""}>
        {track.startTime.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableData>
      <TableData className={selected ? "bg-primary dark:bg-primary" : ""}>
        {track.driver}
      </TableData>
      <TableData className={selected ? "bg-primary dark:bg-primary" : ""}>
        {track.licensePlate}
      </TableData>
    </tr>
  );
};

TableRow.DisplayName = "TableRow";

export { TableRow, type TableRowProps };
