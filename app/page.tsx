import TableCard from "@/components/table-card";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="grid lg:grid-cols-[1fr,2fr] gap-4 p-4 h-full overflow-hidden">
      <div className="grid grid-rows-[1fr, 1fr] gap-4 overflow-hidden">
        <TableCard />

        <div className="overflow-auto">
          <div className="flex h-full w-full">
            <Card className="flex h-full w-full">
              <CardHeader>
                <CardTitle>left bottom</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>right</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
