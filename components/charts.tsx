"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { useSlectedTrackStore } from "@/app/stores/selected-track";
import axios from "axios";

interface GraphPoint {
  timestamp: Date;
  altitude: number[];
  speed: number[];
}

const Charts = () => {
  const { selectedTrack } = useSlectedTrackStore();

  const { status, data } = useQuery({
    queryKey: ["graph", selectedTrack?.id],
    enabled: selectedTrack !== null,
    queryFn: async (): Promise<GraphPoint[]> => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GRAPH}`);

      const data = response.data as { data: GraphPoint[]; count: number };
      return data.data.map((point) => {
        point.timestamp = new Date(point.timestamp);

        return point;
      });
    },
  });

  const chartConfig = {
    elevation: {
      label: "Elevation",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;



  return status === "success" && data?.length > 0 ? (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={100}
            minTickGap={32}
            tickFormatter={(date: Date) => {
              return date.getTime().toString();
            }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="elevation"
            type="natural"
            fill="var(--color-elevation)"
            fillOpacity={0.4}
            stroke="var(--color-elevation)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  ) : <div className="flex flex-col h-full f-full text-center">Please select a track</div>;
};

Charts.DisplayName = "Charts";
export { Charts };
