import { Schema, model, Document } from 'mongoose';

export interface Vehicle extends Document {
  name: string;
  manufacturer: string;
  vehicleModel: string;
  fuel: string;
  type: string;
  vin: string;
  color: string;
  mileage: number;
}

const vehicleSchema = new Schema<Vehicle>(
  {
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    fuel: { type: String, required: true },
    type: { type: String, required: true },
    vin: { type: String, required: true },
    color: { type: String, required: true },
    mileage: { type: Number, required: true }
  },
  { timestamps: true }
);

export const VehicleModel = model<Vehicle>('Vehicle', vehicleSchema);
