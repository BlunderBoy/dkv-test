import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatFormField, MatInput, MatLabel, MatPrefix, MatSuffix} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
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
import {BoldSubstringPipe} from '../../pipes/bold-substring';
import {TitleCasePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {VehicleSearchService} from '../../services/vehicle/search/vehicle-search.service';

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
        BoldSubstringPipe,
        TitleCasePipe,
        MatProgressSpinner
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

    private readonly formBuilder = inject(FormBuilder);
    private readonly vehicleSearchService = inject(VehicleSearchService);
    private readonly router = inject(Router);
    searchResults = this.vehicleSearchService.vehicles;
    searchQuery = this.vehicleSearchService.query;
    loading = this.vehicleSearchService.loading;

    form = this.formBuilder.nonNullable.group({
        searchQuery: ['']
    })

    private readonly searchSubscription = this.form.valueChanges.pipe(
        debounceTime(500),
        map(value => value.searchQuery ?? ""),
        distinctUntilChanged(),
        takeUntilDestroyed()
    ).subscribe(querystring => {
        this.vehicleSearchService.setQuery(querystring)
    });


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
