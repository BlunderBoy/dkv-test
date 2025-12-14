import {Component, computed, inject, signal} from '@angular/core';
import {MatFormField, MatInput, MatLabel, MatPrefix, MatSuffix} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs';
import {VehicleService} from '../../services/vehicle-service';
import {Vehicle} from '../../models/Vehicle.model';
import {
    MatAutocomplete,
    MatAutocompleteSelectedEvent,
    MatAutocompleteTrigger,
    MatOption
} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionSelectionChange} from '@angular/material/core';
import {Router} from '@angular/router';
import {BoldSubstring} from '../../pipes/bold-substring';
import {TitleCasePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-search',
    imports: [
        MatInput,
        MatFormField,
        MatLabel,
        MatIconButton,
        MatSuffix,
        MatIcon,
        MatPrefix,
        ReactiveFormsModule,
        MatAutocomplete,
        MatOption,
        MatAutocompleteTrigger,
        MatSelectModule,
        BoldSubstring,
        TitleCasePipe
    ],
    templateUrl: './search.html',
    styleUrl: './search.css',
})
export class Search {

    formBuilder = inject(FormBuilder);
    vehicleService = inject(VehicleService);
    router = inject(Router);

    form = this.formBuilder.nonNullable.group({
        searchQuery: ['']
    })
    subscription = this.form.valueChanges.pipe(
            debounceTime(500),
            map(value => value.searchQuery ?? ""),
            distinctUntilChanged(),
            switchMap((formValue) => {
                this.searchQuery.set(formValue)
                return this.vehicleService.searchVehicles(formValue);
            }),
            takeUntilDestroyed()
        ).subscribe(formControlValue => {
            this.searchResults.set(formControlValue)
        })

    searchResults = signal<Vehicle[]>([]);
    searchQuery = signal('');
    firstVehicle = computed(() => {
        if (this.searchResults().length > 0) {
            return this.searchResults()[0];
        }
        return undefined;
    })

    resetSearch() {
        this.form.patchValue({
            searchQuery: ''
        })
    }

    /*
    * Here we deselect the option from the internal autocomplete state.
    * We do because the autocomplete remembers the last we selected.
    * We don't want to remember it as each search query is independent of the last.
    * */
    autocompleteOptionSelected(event: MatAutocompleteSelectedEvent) {
        event.option.deselect();
    }

    async navigateToVehicleAndResetControl(vehicleId: string) {
        this.resetSearch();
        await this.router.navigate(['vehicles', vehicleId]);
    }

    async onSearchBarSelected(_: MatOptionSelectionChange, vehicle: Vehicle) {
        await this.navigateToVehicleAndResetControl(vehicle._id);
    }
}
