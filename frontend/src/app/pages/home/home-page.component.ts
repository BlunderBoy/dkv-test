import {Component, effect, inject, signal} from '@angular/core';
import {VehicleService} from '../../services/vehicle-service';
import {Vehicle} from '../../models/Vehicle.model';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {ListItem} from '../../shared/list-item/list-item';
import {MatDialog} from '@angular/material/dialog';
import {CreateEditDialog} from '../../shared/create-edit-dialog/create-edit-dialog';
import {ConfirmationDialog} from '../../shared/confirmation-dialog/confirmation-dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTooltip} from '@angular/material/tooltip';
import {Filters} from '../../shared/filters/filters';
import {VehicleFilters} from '../../models/VehicleFilters.model';
import {MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {Sorters} from '../../shared/sorters/sorters';
import {VehicleSorters} from '../../models/VehicleSorters.model';

@Component({
    selector: 'app-home',
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatIcon,
        MatIconButton,
        ListItem,
        MatFabButton,
        MatTooltip,
        Filters,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        Sorters
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
})
export class HomePage {
    route = inject(Router);
    dialog = inject<MatDialog>(MatDialog);
    private vehicleService = inject(VehicleService);
    toast = inject(MatSnackBar)
    vehicles = signal<Vehicle[]>([]);

    filters = signal<VehicleFilters>({});
    sorters = signal<VehicleSorters>({});

    constructor() {
        effect(() => {
            this.loadData(this.filters(), this.sorters())
        });
    }

    loadData(filters: VehicleFilters, sorters: VehicleSorters) {
        this.vehicleService.getVehicles(filters, sorters).subscribe((backendVehicles) => {
            this.vehicles.set(backendVehicles);
        });
    }

    onAddButtonPressed() {
        const dialogRef = this.dialog.open(CreateEditDialog, {
            data: {
                isEditMode: false
            }
        });

        dialogRef.afterClosed().subscribe((newVehicle: Vehicle | undefined) => {
            if (newVehicle) {
                this.toast.open(`Added ${newVehicle.name} successfully`, "Close", {
                    duration: 4000
                });
                this.vehicles.set([
                    newVehicle,
                    ...this.vehicles()
                ]);
            }
        });
    }

    onEditClicked(vehicle: Vehicle) {

        const dialogRef = this.dialog.open(CreateEditDialog, {
            data: {
                isEditMode: true,
                vehicleData: vehicle
            }
        });

        dialogRef.afterClosed().subscribe((updatedVehicle: Vehicle | undefined) => {
            if (updatedVehicle) {
                this.vehicles.update((vehicles) => {
                    this.toast.open(`Updated ${vehicle.name} successfully`, "Close", {
                        duration: 4000
                    });
                    return vehicles.map(vehicleItem => {
                        if (vehicleItem._id === updatedVehicle?._id) {
                            return updatedVehicle;
                        }
                        return vehicleItem;
                    })
                })
            }
        });
    }

    onDeleteClicked(vehicle: Vehicle) {

        const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
                title: `Are you sure you want to delete ${vehicle.name}`,
                message: `By confirming this ${vehicle.name} will be deleted. This action cannot be reversed.`
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.vehicleService.deleteVehicle(vehicle._id).subscribe({
                    next: (value) => {
                        this.vehicles.update((vehicles) => {
                            return vehicles.filter(item => item._id !== vehicle._id)
                        })
                        this.toast.open(`Deleted ${vehicle.name} successfully`, "Close", {
                            duration: 4000
                        });
                    },
                    error: err => {
                        this.toast.open(`Error encountered while deleting ${vehicle.name}, Error: ${err}`, "Close", {
                            duration: 4000
                        });
                    }
                })
            }
        })
    }

    sortersChanged(sorters: VehicleSorters) {
        this.sorters.set(sorters)
    }

    filtersChanged(filters: VehicleFilters) {
        this.filters.set(filters)
    }
}
