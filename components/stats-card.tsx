"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSlectedTrackStore } from "../app/stores/selected-track";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Stats {
  count: number;
  distance: { unit: string; value: number };
  elevation: {
    gain: { unit: string; value: number };
    loss: { unit: string; value: number };
  };
  speed: {
    avg: { unit: string; value: number };
    max: { unit: string; value: number };
  };
  time: {
    duration: string;
    end: Date;
    start: Date;
  };
}
const StatsCard = () => {
  const { selectedTrack } = useSlectedTrackStore();

  const { status, data: stats } = useQuery({
    queryKey: ["stats", selectedTrack?.id],
    queryFn: async (): Promise<Stats> => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_STATS}`,
        {
          trackId: selectedTrack?.id,
        }
      );

      const data = response.data as Stats;

      data.time.start = new Date(data.time.start);
      data.time.end = new Date(data.time.end);

      console.log(data);

      return data;
    },
  });


  if (status === "success" && stats) {
    return (
      <div className="grid grid-rows-2 grid-cols-2 h-full w-full gap-2">
        <CustomCard
          title="Overview"
          stats={[
            { title: "Trackpoints", value: stats.count.toString() },
            { title: "Duration", value: stats.time.duration },
          ]}
        />
        <CustomCard
          title="Speed"
          stats={[
            {
              title: "Avg",
              value: `${stats.speed.avg.value.toString()} ${
                stats.speed.avg.unit
              }`,
            },
            {
              title: "Max",
              value: `${stats.speed.max.value.toString()} ${
                stats.speed.max.unit
              }`,
            },
          ]}
        />
        <CustomCard
          title="Altitude"
          stats={[
            {
              title: "Gain",
              value: `${stats.elevation.gain.value.toString()} ${
                stats.elevation.gain.unit
              }`,
            },
            {
              title: "Loss",
              value: `${stats.elevation.loss.value.toString()} ${
                stats.elevation.loss.unit
              }`,
            },
          ]}
        />
        <CustomCard
          title="Time"
          stats={[
            {
              title: "Start",
              value: `${stats.time.start.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })} ${stats.time.start.toLocaleTimeString()}`,
            },
            {
              title: "End",
              value: `${stats.time.end.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })} ${stats.time.end.toLocaleTimeString()}`,
            },
          ]}
        />
      </div>
    );
  } else if (!selectedTrack?.id) {
    return (
      <Card className="flex flex-col h-full w-full text-center">
        <CardContent className="flex flex-col w-full h-full p-0">
          <div className="flex flex-col w-full h-full align-center justify-center text-center">
            Please select a track
          </div>
        </CardContent>
      </Card>
    );
  } else if (status === "pending") {
    return (
      <Card className="flex flex-col h-full w-full text-center">
        <CardContent className="flex flex-col w-full h-full p-0">
          <div className="flex flex-col w-full h-full align-center justify-center text-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className="flex flex-col h-full w-full text-center">
        <CardContent className="flex flex-col w-full h-full p-0">
          <div className="flex flex-col w-full h-full align-center justify-center text-center">
            Error
          </div>
        </CardContent>
      </Card>
    );
  }
};

StatsCard.DisplayName = "StatsCard";

export { StatsCard };

interface CustomCardProps {
  title: string;
  stats: StatTupel[];
}

interface StatTupel {
  title: string;
  value: string;
}
const CustomCard = ({ title, stats }: CustomCardProps) => {
  return (
    <Card className="flex flex-col w-full h-full overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-4 pt-0">
        {stats.map((stat) => (
          <span key={stat.title}>
            {stat.title}: {stat.value}
          </span>
        ))}
      </CardContent>
    </Card>
  );
};

CustomCard.DisplayName = "CustomCard";
