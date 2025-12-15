import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BackendService} from '../../backend/backend.service';
import {Vehicle} from '../../../models/Vehicle.model';

@Injectable({
    providedIn: 'root',
})
export class VehicleSearchService {

    private readonly backendService = inject(BackendService);
    private readonly httpService = inject(HttpClient);

    private readonly _query = signal('');
    private readonly _vehicles = signal<Vehicle[]>([]);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<HttpErrorResponse | undefined>(undefined);

    readonly query = this._query;
    readonly vehicles = this._vehicles;
    readonly loading = this._loading;
    readonly error = this._error;

    setQuery(query: string) {
        this._query.set(query);
    }

    private readonly dataFetchEffect = effect((onCleanup) => {

        const query = this._query().trim();

        if (!query) {
            this._vehicles.set([]);
            this._error.set(undefined);
            this._loading.set(false);
            return;
        }

        this._loading.set(true);

        const vehicleSubscription = this.searchVehicles(query).subscribe({
                next: (data) => {
                    this._vehicles.set(data);
                    this._error.set(undefined);
                    this._loading.set(false)
                },
                error: (err: HttpErrorResponse) => {
                    this._error.set(err);
                    this._loading.set(false)
                }
            })

        onCleanup(() => vehicleSubscription.unsubscribe());
    });

    searchVehicles(queryString: string) {
        return this.httpService.post<Vehicle[]>(this.backendService.backendUrl + '/vehicles/search', {
            queryString
        });
    }
}
