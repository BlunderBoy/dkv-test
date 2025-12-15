import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {FUEL_TYPES, FuelType, Vehicle, VEHICLE_TYPES, VehicleType} from '../../models/Vehicle.model';
import {MatOption} from '@angular/material/autocomplete';
import {VehicleService} from '../../services/vehicle/vehicle.service';

type VehicleForm = {
        name: FormControl<string>;
        manufacturer: FormControl<string>;
        vehicleModel: FormControl<string>;
        fuel: FormControl<FuelType>;
        type: FormControl<VehicleType>;
        vin: FormControl<string>;
        color: FormControl<string>;
        mileage: FormControl<number | undefined>;
    };

@Component({
    selector: 'app-create-edit-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        MatError,
        MatHint,
        MatSelect,
        MatOption
    ],
    templateUrl: './create-edit-dialog.component.html',
    styleUrl: './create-edit-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditDialogComponent implements OnInit {
    private readonly dialogData = inject<{ isEditMode?: boolean, vehicleData: Vehicle }>(MAT_DIALOG_DATA);
    private readonly vehicleService = inject(VehicleService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef);

    error = signal('');
    isEditMode = this.dialogData.isEditMode ?? false;

    fuelTypes: readonly FuelType[] = FUEL_TYPES;
    vehicleType: readonly VehicleType[] = VEHICLE_TYPES;

    ngOnInit(): void {
        this.form.patchValue(this.dialogData.vehicleData)
    }

    form = this.formBuilder.nonNullable.group<VehicleForm>({
        name: this.formBuilder.nonNullable.control('', Validators.required),
        manufacturer: this.formBuilder.nonNullable.control('', Validators.required),
        vehicleModel: this.formBuilder.nonNullable.control('', Validators.required),
        fuel: this.formBuilder.nonNullable.control('Diesel', Validators.required),
        type: this.formBuilder.nonNullable.control('Sedan', Validators.required),
        vin: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]),
        color: this.formBuilder.nonNullable.control(''),
        mileage: this.formBuilder.nonNullable.control(undefined, [Validators.min(0)]),
    })

    onDialogSaved(event: Event) {
        event.preventDefault();

        const payload = this.form.getRawValue();

        if (this.isEditMode) {
            this.vehicleService.updateVehicle({...payload, _id: this.dialogData.vehicleData._id}).subscribe({
                next: (value) => {
                    if (value) {
                        this.dialogRef.close(value);
                    }
                },
                error: err => {
                    this.error.set("Editing failed! Either data fetching failed or some backend validator failed!");
                }
            });
        } else {
            this.vehicleService.createVehicle(payload).subscribe({
                next: (value) => {
                    if (value) {
                        this.dialogRef.close(value);
                    }
                },
                error: err => {
                    this.error.set("Creating failed! Either data fetching failed or some backend validator failed!");
                }
            });
        }
    }
}
