import {ChangeDetectionStrategy, Component, effect, output, signal, WritableSignal} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {NgTemplateOutlet} from '@angular/common';
import {VehicleSorters} from '../../models/VehicleSorters.model';

type SortingValues = 'ascending' | '' | 'descending';

@Component({
    selector: 'app-sorters',
    imports: [
        MatIconButton,
        MatIcon,
        ReactiveFormsModule,
        NgTemplateOutlet
    ],
    templateUrl: './sorters.component.html',
    styleUrl: './sorters.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortersComponent {

    sortersChanged = output<VehicleSorters>();
    nameSortingDirection = signal<SortingValues>('ascending');
    mileageSortingDirection = signal<SortingValues>('');

    private readonly emitMessageEffect = effect(() => {
        this.sortersChanged.emit({
            name: this.nameSortingDirection(),
            mileage: this.mileageSortingDirection()
        })
    });


    changeDirection(sortingSignal: WritableSignal<SortingValues>) {
        const otherSignal =
            sortingSignal === this.nameSortingDirection
                ? this.mileageSortingDirection
                : this.nameSortingDirection;

        otherSignal.set('');

        switch (sortingSignal()) {
            case 'ascending':
                sortingSignal.set('descending');
                break;
            case 'descending':
                sortingSignal.set('');
                break;
            default:
                sortingSignal.set('ascending');
        }
    }
}
