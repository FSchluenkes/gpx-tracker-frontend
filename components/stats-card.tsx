"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTheme } from "next-themes";

const StatsCard = () => {
  const { theme } = useTheme();
  const stats = {
    count: 11099,
    distance: { unit: "km", value: 288.35 },
    elevation: {
      gain: { unit: "m", value: 3118 },
      loss: { unit: "m", value: 3137 },
    },
    speed: {
      avg: { unit: "km/h", value: 26.93 },
      max: { unit: "km/h", value: 404.46 },
    },
    time: {
      duration: "10:42:28",
      end: new Date("2022-08-14T17:28:06"),
      start: new Date("2022-08-14T06:45:38"),
    },
  };

  return (
    <Card className="flex flex-col w-full h-full overflow-hidden">
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
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col w-full gap-1">
            <span>Overview</span>
            <div className="flex flex-row flex-wrap w-full gap-x-4">
              <span>Trackpoints: {stats.count}</span>
              <span>Duration: {stats.time.duration}</span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-1">
            <span>Time</span>
            <div className="flex flex-row flex-wrap w-full gap-x-4">
              <span>
                Start: {stats.time.start.toLocaleDateString("en-US")}{" "}
                {stats.time.start.toLocaleTimeString()}
              </span>
              <span>
                End: {stats.time.end.toLocaleDateString("en-US")}{" "}
                {stats.time.end.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-1">
            <span>Speed</span>
            <div className="flex flex-row flex-wrap w-full gap-x-4">
              <span>
                avg: {stats.speed.avg.value} {stats.speed.avg.unit}
              </span>
              <span>
                max: {stats.speed.max.value} {stats.speed.max.unit}
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-1">
            <span>Elevation</span>
            <div className="flex flex-row flex-wrap w-full gap-x-4">
              <span>
                Gain: {stats.elevation.gain.value} {stats.elevation.gain.unit}
              </span>
              <span>
                Loss: {stats.elevation.loss.value} {stats.elevation.loss.unit}
              </span>
            </div>
          </div>
        </CardContent>
      </OverlayScrollbarsComponent>
    </Card>
  );
};

StatsCard.DisplayName = "StatsCard";

export { StatsCard };
