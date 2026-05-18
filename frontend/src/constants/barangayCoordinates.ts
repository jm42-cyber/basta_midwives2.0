// Exact coordinates for Santa Cruz, Laguna barangays
export interface BarangayCoordinate {
  name: string;
  lat: number;
  lng: number;
}

export const SANTA_CRUZ_LAGUNA_CENTER = {
  lat: 14.2792,
  lng: 121.4161,
};

export const SANTA_CRUZ_BARANGAYS: BarangayCoordinate[] = [
  { name: "Alipit", lat: 14.2685, lng: 121.4065 },
  { name: "Bagumbayan", lat: 14.2798, lng: 121.4142 },
  { name: "Bubukal", lat: 14.2512, lng: 121.4251 },
  { name: "Calios", lat: 14.2468, lng: 121.4389 },
  { name: "Duhat", lat: 14.2649, lng: 121.4210 },
  { name: "Gatid", lat: 14.2873, lng: 121.4295 },
  { name: "Jasaan", lat: 14.2597, lng: 121.4357 },
  { name: "Labuin", lat: 14.2415, lng: 121.4462 },
  { name: "Malinao", lat: 14.2734, lng: 121.4029 },
  { name: "Oogong", lat: 14.2826, lng: 121.4208 },
  { name: "Pagsawitan", lat: 14.2921, lng: 121.4086 },
  { name: "Palasan", lat: 14.2559, lng: 121.4173 },
  { name: "Patimbao", lat: 14.2680, lng: 121.4334 },
  { name: "San Jose", lat: 14.2775, lng: 121.4182 },
  { name: "San Juan", lat: 14.2702, lng: 121.4097 },
  { name: "San Pablo Norte", lat: 14.2837, lng: 121.4231 },
  { name: "San Pablo Sur", lat: 14.2761, lng: 121.4265 },
  { name: "Santisima Cruz", lat: 14.2750, lng: 121.4179 },
  { name: "Santo Angel Central", lat: 14.2698, lng: 121.4302 },
  { name: "Santo Angel Norte", lat: 14.2746, lng: 121.4348 },
  { name: "Santo Angel Sur", lat: 14.2653, lng: 121.4359 },
  { name: "Poblacion I", lat: 14.2769, lng: 121.4179 },
  { name: "Poblacion II", lat: 14.2782, lng: 121.4193 },
  { name: "Poblacion III", lat: 14.2795, lng: 121.4205 },
  { name: "Poblacion IV", lat: 14.2758, lng: 121.4162 },
  { name: "Poblacion V", lat: 14.2743, lng: 121.4150 },
];

// Helper function to get coordinates by barangay name
export const getBarangayCoordinates = (name: string): BarangayCoordinate | undefined => {
  return SANTA_CRUZ_BARANGAYS.find(
    (brgy) => brgy.name.toLowerCase().includes(name.toLowerCase()) || 
              name.toLowerCase().includes(brgy.name.toLowerCase())
  );
};
