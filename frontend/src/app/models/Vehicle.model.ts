export interface Vehicle {
  _id: string;
  name: string;
  manufacturer: string;
  vehicleModel: string;
  fuel: FuelType;
  type: VehicleType;
  vin: string;
  color?: string;
  mileage?: number;
}

export const FUEL_TYPES = [
  'Diesel',
  'Electric',
  'Gasoline',
  'Hybrid',
] as const;

export type FuelType = typeof FUEL_TYPES[number];

export const VEHICLE_TYPES = [
    'Coupe',
    'SUV',
    'Sedan',
    'Truck'
] as const;

export type VehicleType = typeof VEHICLE_TYPES[number];
