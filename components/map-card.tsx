"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useSlectedTrackStore } from "@/app/stores/selected-track";

const Map = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
});

const MapCard = () => {
  const { selectedTrack } = useSlectedTrackStore();
  return (
    <div className="overflow-hidden h-full w-full">
      <Tabs className="flex flex-col h-full w-full" defaultValue="maps">
        <TabsList className="flex w-full">
          <TabsTrigger value="maps" className="w-full">
            Map
          </TabsTrigger>
          <TabsTrigger value="charts" className="w-full">
            Charts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="maps" className="h-full w-full">
          <div className="flex flex-col w-full h-full ">
            <Map />
          </div>
        </TabsContent>
        <TabsContent
          value="charts"
          className="h-full w-full bg-blue-500 rounded-lg"
        >
          {JSON.stringify(selectedTrack)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

MapCard.DisplayName = "MapCard";
export { MapCard };
