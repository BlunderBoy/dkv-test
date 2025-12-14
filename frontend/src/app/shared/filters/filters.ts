import {Component, effect, inject, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {VehicleFilters} from '../../models/VehicleFilters.model';
import {MatOption, MatSelect} from '@angular/material/select';
import {FUEL_TYPES, FuelType, VEHICLE_TYPES, VehicleType} from '../../models/Vehicle.model';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
    selector: 'app-filters',
    imports: [
        MatSlider,
        MatSliderRangeThumb,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatButton,
        MatLabel,
        MatExpansionModule,
        MatSelect,
        MatOption,
        MatIconButton,
        MatIcon,
        MatSuffix,
        MatCheckbox
    ],
    templateUrl: './filters.html',
    styleUrl: './filters.css',
})
export class Filters {
    formBuilder = inject(FormBuilder);
    filtersChanged = output<VehicleFilters>({});
    fuelTypes: readonly FuelType[] = FUEL_TYPES;
    vehicleType: readonly VehicleType[] = VEHICLE_TYPES;
    form = this.formBuilder.nonNullable.group({
        fuelType: [''],
        vehicleType: [''],
        minimumMileage: [0, Validators.min(0)],
        maximumMileage: [150000, Validators.max(150000)]
    });

    constructor() {
        this.disableMileageFilters();
        effect(() => {
            if (this.filtersDisabled()) {
                this.disableMileageFilters();
            } else {
                this.enableMileageFilters();
            }
        });
    }

    disableMileageFilters() {
        this.form.get('minimumMileage')?.disable();
        this.form.get('maximumMileage')?.disable();
    }

    enableMileageFilters() {
        this.form.get('minimumMileage')?.enable();
        this.form.get('maximumMileage')?.enable();
    }


    filtersDisabled = signal<boolean>(true);

    formatLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return `${value}`;
    }

    onFiltersReset() {
        this.form.reset({
            fuelType: '',
            vehicleType: '',
            minimumMileage: 0,
            maximumMileage: 150000
        });
        this.filtersChanged.emit(this.form.value);
    }

    onFiltersSaved() {
        this.filtersChanged.emit(this.form.value);
    }

    clearFilter(controlName: string) {
        if (controlName === 'type') {
            this.form.get('vehicleType')?.reset();
        }

        if (controlName === 'fuel') {
            this.form.get('fuelType')?.reset();
        }
    }

    onUseFiltersChange() {
        this.filtersDisabled.set(!this.filtersDisabled())
    }
}
