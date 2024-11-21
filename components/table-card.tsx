"use client";

import useGlobalDragState from "@/app/hooks/use-global-drag-state";
import { DropZone } from "./drop-zone";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TrackTable } from "./track-table";

const TABS = {
  table: 0,
  upload: 1,
};

const TableCard = () => {
  const isDragging = useGlobalDragState();

  const [api, setApi] = useState<CarouselApi>();
  const [activeTab, setActiveTab] = useState<string>("table");

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setActiveTab(api.selectedScrollSnap() === 0 ? "table" : "upload");
    });
  }, [api]);

  useEffect(() => {
    if (isDragging && activeTab !== "upload") {
      api?.scrollTo(TABS.upload);
    }
  }, [isDragging, activeTab, api]);

  return (
    <div className="overflow-hidden flex h-full w-full">
      <Tabs
        className="flex flex-col h-full w-full gap-2"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full">
          <TabsTrigger
            value="table"
            className="w-full"
            onClick={() => api?.scrollTo(TABS.table)}
          >
            Table
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="w-full"
            onClick={() => api?.scrollTo(TABS.upload)}
          >
            Upload
          </TabsTrigger>
        </TabsList>
        <Carousel
          className="w-full h-full overflow-auto rounded-lg"
          setApi={setApi}
          disableKeyControls
        >
          <CarouselContent className="h-full">
            <CarouselItem key={"table"} className="flex flex-col w-full h-full">
              <TrackTable />
            </CarouselItem>
            <CarouselItem key={"upload"} className="flex flex-colw-full h-full">
              <DropZone />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </Tabs>
    </div>
  );
};

TableCard.displayName = "TableCard";

export { TableCard };
