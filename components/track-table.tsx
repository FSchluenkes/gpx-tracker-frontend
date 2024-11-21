"use Client";

import { Track } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useRef } from "react";
import { TableHeader } from "./track-table/table-header";
import { useRowSelect } from "@/app/hooks/use-row-select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TableContent } from "./track-table/table-content";

const TrackTable = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
  const { theme } = useTheme();
  const { status, data } = useQuery({
    queryKey: ["tracks"],
    refetchInterval: 10 * 1_000,
    queryFn: async (): Promise<Track[]> => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_TRACK}`);

      const data = response.data as Track[];

      return data.map((track) => {
        track.startTime = new Date(track.startTime);
        track.endTime = new Date(track.endTime);

        return track;
      });
    },
  });
  const ref = useRef<HTMLTableElement>(null);
  const { selectedTrack, setSelectedTrack } = useRowSelect(data || [], ref);

  return (
    <div className="flex flex-col w-full h-full bg-background dark:bg-background rounded-lg border overflow-hidden">
      <OverlayScrollbarsComponent
        className="w-full h-full overflow-auto flex flex-col"
        element="div"
        options={{
          scrollbars: {
            theme: theme === "light" ? "os-theme-dark" : "os-theme-light",
            autoHide: "scroll",
          },
        }}
        defer
      >
        <table
          className={cn(
            "table-fixed min-w-full h-full divide-y bg-background dark:bg-background",
            className
          )}
          ref={ref}
          {...props}
          tabIndex={-1}
        >
          <thead className="bg-muted dark:bg-muted sticky top-0 z-10 opacity-100">
            <tr>
              <TableHeader>Date</TableHeader>
              <TableHeader>Driver</TableHeader>
              <TableHeader>Vehicle</TableHeader>
            </tr>
          </thead>
          <tbody className="relative divide-y border-muted dark:border-muted">
            <TableContent
              status={status}
              data={data || []}
              selectedTrack={selectedTrack}
              setSelectedTrack={setSelectedTrack}
            />
          </tbody>
        </table>
      </OverlayScrollbarsComponent>
    </div>
  );
};

TrackTable.displayName = "TrackTable";

export { TrackTable };
