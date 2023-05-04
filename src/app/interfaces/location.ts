export interface Location {
  country: string;
  lat: number;
  lng: number;
  description: string;
  locations: Array<Location>;
}

