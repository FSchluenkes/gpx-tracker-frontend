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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_GRAPH}`,
        {
          trackId: selectedTrack?.id,
        }
      );

      const data = response.data as { data: GraphPoint[]; count: number };
      return data.data.map((point) => {
        point.timestamp = new Date(point.timestamp);

        return point;
      });
    },
  });

  const chartConfig = {
    altitude: {
      label: "Altitude",
      color: "hsl(var(--chart-1))",
    },
    speed: {
      label: "Speed",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  return (
    <div className="flex flex-col h-full w-full">
      {status === "success" && data?.length > 0 ? (
        <div className="flex flex-col w-full- h-full gap-4">
          <Card className="flex flex-col w-full h-full">
            <CardHeader>
              <CardTitle>Altitude</CardTitle>
              <CardDescription>
                This Chart displays the altitude of the track over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col w-full h-full">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto w-full h-full"
              >
                <AreaChart accessibilityLayer data={data || []}>
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
                    content={
                      <ChartTooltipContent
                        hideLabel
                        className="w-[180px]"
                        formatter={(value, name, item) => (
                          <>
                            <div className="flex w-full">
                              {[
                                item.payload.timestamp as Date,
                              ].toLocaleString()}
                            </div>

                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                              style={
                                {
                                  "--color-bg": `var(--color-${name})`,
                                } as React.CSSProperties
                              }
                            />

                            {chartConfig[name as keyof typeof chartConfig]
                              ?.label || name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {value}
                              <span className="font-normal text-muted-foreground">
                                m
                              </span>
                            </div>
                          </>
                        )}
                      />
                    }
                    cursor={false}
                    defaultIndex={2}
                  />

                  <Area
                    dataKey="altitude"
                    type="natural"
                    fill="var(--color-altitude)"
                    fillOpacity={0.4}
                    stroke="var(--color-altitude)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="flex flex-col w-full h-full">
            <CardHeader>
              <CardTitle>Speed</CardTitle>
              <CardDescription>
                This Chart displays the speed of the track over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col w-full h-full">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto w-full h-full"
              >
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
                    content={
                      <ChartTooltipContent
                        hideLabel
                        className="w-[180px]"
                        formatter={(value, name, item) => (
                          <>
                            <div className="flex w-full">
                              {[
                                item.payload.timestamp as Date,
                              ].toLocaleString() + ""}
                            </div>

                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                              style={
                                {
                                  "--color-bg": `var(--color-${name})`,
                                } as React.CSSProperties
                              }
                            />

                            {chartConfig[name as keyof typeof chartConfig]
                              ?.label || name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {value}
                              <span className="font-normal text-muted-foreground">
                                km/h
                              </span>
                            </div>
                          </>
                        )}
                      />
                    }
                    cursor={false}
                    defaultIndex={1}
                  />

                  <Area
                    dataKey="speed"
                    type="natural"
                    fill="var(--color-speed)"
                    fillOpacity={0.4}
                    stroke="var(--color-speed)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col h-full f-full text-center">
          Please select a track
        </div>
      )}
    </div>
  );
};

Charts.DisplayName = "Charts";
export { Charts };
