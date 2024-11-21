export interface Track {
    id: number;
    driver: string;
    licensePlate: string;
    startTime: Date;
    endTime: Date;
}

export interface Point {
  id: number;
  lat: number;
  lon: number;
  alt: number;
  timestamp: Date;
}