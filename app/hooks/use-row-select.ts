"use client";

import { RefObject, useEffect } from "react";
import { Track } from "@/lib/types";
import { useSlectedTrackStore } from "../stores/selected-track";

export function useRowSelect(
  tracks: Track[],
  ref: RefObject<HTMLTableElement>
) {
  const { selectedTrack, setSelectedTrack } = useSlectedTrackStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!tracks.length) return;
      if (!selectedTrack) {
        setSelectedTrack(tracks[0]);
        return;
      }

      const currentIndex = tracks.findIndex(
        (track) => track.id === selectedTrack?.id
      );

      if (currentIndex === -1) {
        setSelectedTrack(null);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        setSelectedTrack(tracks[newIndex]);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const newIndex =
          currentIndex < tracks.length - 1
            ? currentIndex + 1
            : tracks.length - 1;
        setSelectedTrack(tracks[newIndex]);
      }
    };

    const table = ref.current;
    if (table) table.addEventListener("keydown", handleKeyDown);

    return () => {
      if (table) table.removeEventListener("keydown", handleKeyDown);
    };
  }, [tracks, setSelectedTrack, selectedTrack, ref]);

  return { selectedTrack, setSelectedTrack };
}
