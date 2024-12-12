"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Charts } from "./charts";

const Map = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
});

const MapCard = () => {
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
        <TabsContent value="charts" className="h-full w-full rounded-lg">
          <Charts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

MapCard.DisplayName = "MapCard";
export { MapCard };
