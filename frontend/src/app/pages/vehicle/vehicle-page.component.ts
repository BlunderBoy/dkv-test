import {Component, inject, signal, WritableSignal} from '@angular/core';
import {VehicleService} from '../../services/vehicle-service';
import {ActivatedRoute} from '@angular/router';
import {Vehicle} from '../../models/Vehicle.model';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {ListItem} from '../../shared/list-item/list-item';
import {MatTooltip} from '@angular/material/tooltip';
import {map, filter, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-vehicle',
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        ListItem,
        MatTooltip
    ],
    templateUrl: './vehicle-page.component.html',
    styleUrl: './vehicle-page.component.css',
})
export class VehiclePage {
    private vehicleService = inject(VehicleService);
    private activatedRoute = inject(ActivatedRoute)
    vehicle: WritableSignal<Vehicle | undefined> = signal(undefined);

    readonly paramMap = this.activatedRoute.paramMap
        .pipe(
            map(params => params.get('vehicleId')),
            filter((id) => id !== null),
            switchMap(id => this.vehicleService.getVehicleById(id)),
            takeUntilDestroyed()
        )
        .subscribe(vehicleData => {
            this.vehicle.set(vehicleData);
        });
}
