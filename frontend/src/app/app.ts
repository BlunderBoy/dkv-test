import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {Search} from './shared/search/search';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, NgOptimizedImage, Search],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
    router = inject(Router);
}
