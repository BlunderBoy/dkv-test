import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {BackendService} from '../backend/backend.service';
import {VehicleFilters} from '../../models/VehicleFilters.model';
import {VehicleSorters} from '../../models/VehicleSorters.model';
import {Vehicle} from '../../models/Vehicle.model';

@Injectable({
    providedIn: 'root',
})
export class VehicleService {

    private readonly backendService = inject(BackendService);
    private readonly httpService = inject(HttpClient);

    private readonly _filters = signal<VehicleFilters>({});
    private readonly _sorters = signal<VehicleSorters>({});
    private readonly _vehicles = signal<Vehicle[]>([]);
    private readonly _error = signal<HttpErrorResponse | undefined>(undefined);
    private readonly _loading = signal<boolean>(false);

    readonly filters = this._filters;
    readonly sorters = this._sorters;
    readonly vehicles = this._vehicles;
    readonly error = this._error;
    readonly loading = this._loading;

    private readonly dataFetchEffect = effect((onCleanup) => {
        this._loading.set(true);
        const filter = this._filters();
        const sorter = this._sorters();

        const vehicleSubscription = this.getVehicles(filter, sorter).subscribe({
            next: (data) => {
                this._vehicles.set(data);
                this._error.set(undefined);
                this._loading.set(false)
            },
            error: err => {
                this._error.set(err);
                this._loading.set(false)
            }
        })

        onCleanup(() => vehicleSubscription.unsubscribe());
    });

    public setFilters(filters: VehicleFilters) {
        this._filters.set(filters);
    }

    public setSorters(sorters: VehicleSorters) {
        this._sorters.set(sorters);
    }

    getVehicles(filters: VehicleFilters, sorters: VehicleSorters) {
        return this.httpService.get<Vehicle[]>(this.backendService.backendUrl + '/vehicles', {
            params: this.toHttpParams(filters, sorters)
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
        return this.httpService.post<Vehicle | undefined>(this.backendService.backendUrl + '/vehicles', vehicleData);
    }

    getVehicleById(id: string) {
        return this.httpService.get<Vehicle>(this.backendService.backendUrl + `/vehicles/${id}`);
    }

    updateVehicle(vehicle: Vehicle) {
        return this.httpService.put<Vehicle>(this.backendService.backendUrl + `/vehicles/${vehicle._id}`, vehicle);
    }

    deleteVehicle(vehicleId: string) {
        return this.httpService.delete<Vehicle>(this.backendService.backendUrl + `/vehicles/${vehicleId}`,);
    }

    addVehicleToLocal(vehicle: Vehicle) {
        this._vehicles.update(list => [vehicle, ...list]);
    }

    updateVehicleInLocal(updatedVehicle: Vehicle) {
        this._vehicles.update(list => list.map(v => v._id === updatedVehicle._id ? updatedVehicle : v));
    }

    removeVehicleFromLocal(id: string) {
        this._vehicles.update(list => list.filter(v => v._id !== id));
    }
}
