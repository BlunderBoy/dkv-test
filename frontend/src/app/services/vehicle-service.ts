import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Vehicle} from '../models/Vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  readonly backendUrl = 'http://localhost:3000'; // Adjust the URL as needed
  private httpService = inject(HttpClient);

  getVehicles() {
      return this.httpService.get<Vehicle[]>(this.backendUrl + '/vehicles');
  }

  createVehicle(vehicleData: Vehicle) {
      return this.httpService.post<Vehicle | undefined>(this.backendUrl + '/vehicles', vehicleData);
  }

  getVehicleById(id: string) {
      return this.httpService.get<Vehicle>(this.backendUrl + `/vehicles/${id}`);
  }
}
