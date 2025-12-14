export interface VehicleFilters {
    fuel?: 'Diesel' | 'Electric' | 'Gasoline' | 'Hybrid';
    type?: 'Coupe' | 'SUV' | 'Sedan' | 'Truck';
    minimumMileage?: number,
    maximumMileage?: number
}
