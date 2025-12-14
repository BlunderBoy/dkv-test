import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Vehicle} from '../models/Vehicle.model';
import {VehicleSorters} from '../models/VehicleSorters.model';
import {VehicleFilters} from '../models/VehicleFilters.model';

@Injectable({
    providedIn: 'root',
})
export class VehicleService {

    readonly backendUrl = 'http://localhost:3000'; // Adjust the URL as needed
    private httpService = inject(HttpClient);

    getVehicles(filters: VehicleFilters, sorters: VehicleSorters) {
        return this.httpService.get<Vehicle[]>(this.backendUrl + '/vehicles', {
            params: this.toHttpParams(filters, sorters)
        });
    }

    searchVehicles(queryString: string) {
        return this.httpService.post<Vehicle[]>(this.backendUrl + '/vehicles/search', {
            queryString
        });
    }

    private toHttpParams(
        filters: VehicleFilters,
        sorters: VehicleSorters
    ): HttpParams {

        let params = new HttpParams();

        for (const [key, value] of Object.entries(filters)) {
            if (value != null && value !== '') {
                params = params.set(`filters[${key}]`, String(value));
            }
        }

        for (const [key, value] of Object.entries(sorters)) {
            if (value != null && value !== '') {
                params = params.set(`sorters[${key}]`, String(value));
            }
        }

        return params;
    }

    createVehicle(vehicleData: Omit<Vehicle, '_id'>) {
        return this.httpService.post<Vehicle | undefined>(this.backendUrl + '/vehicles', vehicleData);
    }

    getVehicleById(id: string) {
        return this.httpService.get<Vehicle>(this.backendUrl + `/vehicles/${id}`);
    }

    updateVehicle(vehicle: Vehicle) {
        return this.httpService.put<Vehicle>(this.backendUrl + `/vehicles/${vehicle._id}`, vehicle);
    }

    deleteVehicle(vehicleId: string) {
        return this.httpService.delete<Vehicle>(this.backendUrl + `/vehicles/${vehicleId}`,);
    }
}
