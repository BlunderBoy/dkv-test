import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import vehicleRoutes from './routes/vehicles';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/vehicles', vehicleRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicleDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
