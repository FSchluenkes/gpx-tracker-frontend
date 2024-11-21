import { MapCard } from "@/components/map-card";
import { StatsCard } from "@/components/stats-card";
import { TableCard } from "@/components/table-card";

export default function Dashboard() {
  return (
    <div className="grid lg:grid-cols-[1fr,2fr] gap-4 p-4 h-full overflow-hidden">
      <div className="grid grid-rows-[1fr, 1fr] gap-4 overflow-hidden">
        <TableCard />

        <StatsCard />
      </div>

      <MapCard />
    </div>
  );
}
