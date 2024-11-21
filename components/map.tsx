"use Client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Point } from "@/lib/types";
import { useTheme } from "next-themes";
import { Marker, Popup, useMap } from "react-leaflet";
import { useSlectedTrackStore } from "@/app/stores/selected-track";
import { DivIcon, LatLngBounds, LatLngTuple } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

interface FitBoundsProps {
  bounds: LatLngBounds | undefined;
}
function FitBounds({ bounds }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, {
      animate: true,
      duration: 0.2,
    });
  }, [bounds, map]);

  return null;
}

const Map = () => {
  const { theme } = useTheme();
  const { selectedTrack } = useSlectedTrackStore();
  const { data } = useQuery({
    queryKey: [selectedTrack?.id],
    queryFn: async (): Promise<Point[]> => {
      if (!selectedTrack) return [];
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_PATH}`, {
        trackId: selectedTrack.id,
      });

      const data = response.data as Point[];

      return data.map((point) => {
        point.timestamp = new Date(point.timestamp);

        return point;
      });
    },
    enabled: selectedTrack != null,
  });

  const positions: LatLngTuple[] | undefined = data?.map((point) => [
    point.lat,
    point.lon,
  ]);

  const bounds =
    positions && positions.length > 0
      ? new LatLngBounds(positions || [])
      : undefined;

  const startIcon = new DivIcon({
    html: `<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-foreground dark:border-foreground "/>`,
    className: "",
    iconSize: [24, 24],
  });

  const endIcon = new DivIcon({
    html: `
    <div class="
      w-6 h-6 rounded-full border-2 border-foreground dark:border-foreground bg-white"
      style="background: repeating-conic-gradient(#fff 0 90deg, #000 0 180deg) 0 0/8px 8px;"
      />
  `,
    className: "",
    iconSize: [24, 24],
  });

  return (
    <MapContainer
      center={[51.480843, 7.224956]}
      zoom={13}
      scrollWheelZoom={true}
      className="flex w-full h-full rounded-lg z-10"
    >
      <TileLayer
        url={
          theme === "light"
            ? "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
            : "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
        }
        className="low-res-layer z-0"
      />
      <TileLayer
        url={
          theme === "light"
            ? "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            : "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        }
        className="high-res-layer z-10"
        updateWhenIdle={true}
        updateWhenZooming={false}
      />
      {positions && positions.length > 0 && (
        <>
          <Polyline
            className="stroke-primary dark:stroke-primary"
            positions={positions}
          />

          <Marker icon={startIcon} position={positions[0]}>
            <Popup></Popup>
          </Marker>
          <Marker icon={endIcon} position={positions[positions.length - 1]}>
            <Popup></Popup>
          </Marker>
        </>
      )}
      <FitBounds bounds={bounds} />
    </MapContainer>
  );
};

Map.DisplayName = "Map";
export { Map };
