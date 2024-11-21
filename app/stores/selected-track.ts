import { create } from "zustand";
import { Track } from "@/lib/types";

interface TrackStore {
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
}

export const useSlectedTrackStore = create<TrackStore>((set) => ({
  selectedTrack: null,
  setSelectedTrack: (track) => set({ selectedTrack: track }),
}));
