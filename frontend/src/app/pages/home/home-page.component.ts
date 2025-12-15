import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {Vehicle} from '../../models/Vehicle.model';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {ListItemComponent} from '../../shared/list-item/list-item.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateEditDialogComponent} from '../../shared/create-edit-dialog/create-edit-dialog.component';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {MatTooltip} from '@angular/material/tooltip';
import {FiltersComponent} from '../../shared/filters/filters.component';
import {VehicleFilters} from '../../models/VehicleFilters.model';
import {MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {SortersComponent} from '../../shared/sorters/sorters.component';
import {VehicleSorters} from '../../models/VehicleSorters.model';
import {VehicleService} from '../../services/vehicle/vehicle.service';
import {ToastService} from '../../services/toast/toast.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
    selector: 'app-home',
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatIcon,
        MatIconButton,
        ListItemComponent,
        MatFabButton,
        MatTooltip,
        FiltersComponent,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        SortersComponent,
        RouterLink,
        MatProgressSpinner
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    private readonly dialog = inject<MatDialog>(MatDialog);
    private readonly vehicleService = inject(VehicleService);
    private readonly toast = inject(ToastService);

    readonly vehicles = this.vehicleService.vehicles;
    readonly loading = this.vehicleService.loading;
    readonly filters = signal<VehicleFilters>({});
    readonly sorters = signal<VehicleSorters>({});

    private readonly loadVehiclesEffect = effect((onCleanup) => {
        const filters = this.filters();
        const sorters = this.sorters();

        if (Object.keys(filters).length === 0 && Object.keys(sorters).length === 0) {
            return;
        }

        this.vehicleService.setSorters(sorters);
        this.vehicleService.setFilters(filters);
    });

    onAddButtonPressed() {
        const dialogRef = this.dialog.open(CreateEditDialogComponent, {
            data: {
                isEditMode: false
            }
        });

        dialogRef.afterClosed().subscribe((newVehicle: Vehicle | undefined) => {
            if (newVehicle) {
                this.toast.message(`Added ${newVehicle.name} successfully`);
                this.vehicleService.addVehicleToLocal(newVehicle);
            }
        });
    }

    onEditClicked(vehicle: Vehicle) {

        const dialogRef = this.dialog.open(CreateEditDialogComponent, {
            data: {
                isEditMode: true,
                vehicleData: vehicle
            }
        });

        dialogRef.afterClosed().subscribe((updatedVehicle: Vehicle | undefined) => {
            if (updatedVehicle) {
                this.toast.message(`Updated ${vehicle.name} successfully`);
                this.vehicleService.updateVehicleInLocal(updatedVehicle);
            }
        });
    }

    onDeleteClicked(vehicle: Vehicle) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: `Are you sure you want to delete ${vehicle.name}`,
                message: `By confirming this ${vehicle.name} will be deleted. This action cannot be reversed.`
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.vehicleService.deleteVehicle(vehicle._id).subscribe({
                    next: () => {
                        this.toast.message(`Deleted ${vehicle.name} successfully`);
                        this.vehicleService.removeVehicleFromLocal(vehicle._id);
                    },
                    error: err => {
                        this.toast.error(`Error encountered while deleting ${vehicle.name}`);
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
