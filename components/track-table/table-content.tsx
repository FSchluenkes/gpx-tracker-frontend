import { Track } from "@/lib/types";
import { TableRow } from "./table-row";
import { TableData } from "./table-data";

interface TableContentProps {
  status: "success" | "error" | "pending";
  data: Track[];
  selectedTrack?: Track | null;
  setSelectedTrack: (selectedTrack: Track) => void;
}

const TableContent = ({
  status,
  data,
  selectedTrack,
  setSelectedTrack,
}: TableContentProps) => {
  if (status === "success" && data.length > 0) {
    return data?.map((track) => (
      <TableRow
        key={track.id}
        track={track}
        onClick={() => setSelectedTrack(track)}
        selected={selectedTrack?.id === track.id}
      />
    ));
  } else if ((status = "pending")) {
    return (
      <tr>
        <TableData colSpan={3}>
          <div className="flex flex-col w-full h-full align-center justify-center text-center">
            Loading
          </div>
        </TableData>
      </tr>
    );
  } else {
    return "error";
  }
};

TableContent.DisplayName = "TableContent";
export { TableContent, type TableContentProps };
