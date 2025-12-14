import {Request, Response, Router} from 'express';
import {Vehicle, VehicleModel} from '../models/Vehicle';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { filters = {}, sorters = {} } = req.query as {
            filters?: Record<string, string>;
            sorters?: Record<string, string>;
        };

        const filter: any = {};

        const parseCSV = (value: string) => value.split(',').map(v => v.trim());

        if (filters.fuelType) {
            const fuels = parseCSV(filters.fuelType);
            filter.fuel = { $in: fuels };
        }

        if (filters.vehicleType) {
            const types = parseCSV(filters.vehicleType);
            filter.type = { $in: types };
        }

        if (filters.minimumMileage || filters.maximumMileage) {
            filter.mileage = {};
            if (filters.minimumMileage) {
                filter.mileage.$gte = Number(filters.minimumMileage);
            }
            if (filters.maximumMileage) {
                filter.mileage.$lte = Number(filters.maximumMileage);
            }
        }

        const sort: Record<string, 1 | -1> = {};
        if (Object.keys(sorters).length === 0) {
            sort['_id'] = -1;
        }
        for (const [key, direction] of Object.entries(sorters)) {
            if (direction === 'ascending') {
                sort[key] = 1;
            } else if (direction === 'descending') {
                sort[key] = -1;
            }
        }

        const vehicles = await VehicleModel
            .find(filter)
            .collation({ locale: 'en', strength: 2 })
            .sort(sort);

        res.status(200).json(vehicles);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve vehicles' });
    }
});


router.get('/options', async (req: Request, res: Response) => {
    try {
        const manufacturers = await VehicleModel.distinct('manufacturer');
        const fuelTypes = await VehicleModel.distinct('fuel');
        const vehicleTypes = await VehicleModel.distinct('type');
        res.status(200).json({
            manufacturers,
            fuelTypes,
            vehicleTypes
        })
    } catch (err: any) {
        res.status(400).json({error: 'Failed to get options', details: err.message});
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

router.post('/search', async (req: Request, res: Response) => {
    try {
        const queryString: string = req.body.queryString.trim();

        const makeRegex = (value: any) =>
            new RegExp(String(value), 'i');
        let filter: any = {
            $or: [
                {manufacturer: makeRegex(queryString)},
                {name: makeRegex(queryString)},
                {vehicleModel: makeRegex(queryString)},
                {fuel: makeRegex(queryString)},
                {type: makeRegex(queryString)}
            ]
        }
        const vehicles = await VehicleModel.find(filter);

        res.status(201).json(vehicles);
    } catch (err: any) {
        res.status(400).json({error: 'Failed to add vehicle', details: err.message});
    }
});

router.put('/:_id', async (req: Request, res: Response) => {
    try {
        const vehicleData: Partial<Vehicle> = req.body;
        const {_id, ...rest} = vehicleData;

        await VehicleModel.updateOne(
            {_id},
            {$set: rest}
        );

        const updatedVehicle = await VehicleModel.findById(_id);

        res.status(200).json(updatedVehicle);
    } catch (err: any) {
        res.status(400).json({error: 'Failed to update vehicle', details: err.message});
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

router.delete('/:_id', async (req: Request, res: Response) => {
    try {
        const vehicle = await VehicleModel.deleteOne({
            _id: req.params._id
        });
        res.status(200).json(vehicle);
    } catch (err) {
        res.status(500).json({error: 'Failed to delete vehicle'});
    }
});

export default router;
