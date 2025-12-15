import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {SearchComponent} from './shared/search/search.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NgOptimizedImage, SearchComponent],
    templateUrl: './app.html',
    styleUrl: './app.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
    protected readonly title = signal('frontend');
    router = inject(Router);
}
