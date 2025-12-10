import {Request, Response, Router} from 'express';
import {VehicleModel, Vehicle} from '../models/Vehicle';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const vehicles: Vehicle[] = await VehicleModel.find();
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(500).json({error: 'Failed to retrieve vehicles'});
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const vehicleData: Partial<Vehicle> = req.body;
        const vehicle = new VehicleModel(vehicleData);
        const savedVehicle = await vehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err: any) {
        res.status(400).json({error: 'Failed to add vehicle', details: err.message});
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const vehicle = await VehicleModel.findById(req.params.id);
        if (!vehicle) return res.status(404).json({error: 'Vehicle not found'});
        res.status(200).json(vehicle);
    } catch (err) {
        res.status(500).json({error: 'Failed to retrieve vehicle'});
    }
});

export default router;
