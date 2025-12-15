import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
    selector: 'app-list-item',
    imports: [],
    templateUrl: './list-item.component.html',
    styleUrl: './list-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
    label = input<string>('placeholder');
    value = input<string | number | undefined>('placeholder');
}
