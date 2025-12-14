import {Component, effect, output, signal, WritableSignal} from '@angular/core';
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
    templateUrl: './sorters.html',
    styleUrl: './sorters.css',
})
export class Sorters {

    sortersChanged = output<VehicleSorters>();
    nameSortingDirection = signal<SortingValues>('ascending');
    mileageSortingDirection = signal<SortingValues>('');

    constructor() {
        effect(() => {
            this.sortersChanged.emit({
                name: this.nameSortingDirection(),
                mileage: this.mileageSortingDirection()
            })
        });
    }


    changeDirection(signal: WritableSignal<SortingValues>) {
        const otherSignal =
            signal === this.nameSortingDirection
                ? this.mileageSortingDirection
                : this.nameSortingDirection;

        otherSignal.set('');

        switch (signal()) {
            case 'ascending':
                signal.set('descending');
                break;
            case 'descending':
                signal.set('');
                break;
            default:
                signal.set('ascending');
        }
    }
}
