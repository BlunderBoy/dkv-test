import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Vehicle} from '../../models/Vehicle.model';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {ListItemComponent} from '../../shared/list-item/list-item.component';
import {MatTooltip} from '@angular/material/tooltip';
import {map, filter, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {VehicleService} from '../../services/vehicle/vehicle.service';

@Component({
    selector: 'app-vehicle',
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        ListItemComponent,
        MatTooltip
    ],
    templateUrl: './vehicle-page.component.html',
    styleUrl: './vehicle-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclePageComponent {
    private readonly vehicleService = inject(VehicleService);
    private readonly activatedRoute = inject(ActivatedRoute);
    readonly vehicle = signal<Vehicle | undefined>(undefined);

    constructor() {
        this.activatedRoute.paramMap
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

}
