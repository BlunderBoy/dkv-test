import {Component, input} from '@angular/core';

@Component({
  selector: 'app-list-item',
  imports: [],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css',
})
export class ListItem {
  label = input<string>('placeholder');
  value = input<string | number | undefined>('placeholder');
}
