import {Document, model, Schema} from 'mongoose';

export interface Vehicle extends Document {
    _id: string;
    name: string;
    manufacturer: string;
    vehicleModel: string;
    fuel: 'Diesel' | 'Electric' | 'Gasoline' | 'Hybrid';
    type: 'Coupe' | 'SUV' | 'Sedan' | 'Truck';
    vin: string;
    color?: string;
    mileage?: number;
}

const vehicleSchema = new Schema<Vehicle>(
    {
        name: {type: String, required: true},
        manufacturer: {type: String, required: true},
        vehicleModel: {type: String, required: true},
        fuel: {type: String, required: true},
        type: {type: String, required: true},
        vin: {type: String, required: true},
        color: {type: String, required: false},
        mileage: {type: Number, required: false}
    },
    {timestamps: true}
);

export const VehicleModel = model<Vehicle>('Vehicle', vehicleSchema);
