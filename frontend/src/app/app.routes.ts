import {Routes} from '@angular/router';
import {HomePageComponent} from './pages/home/home-page.component';
import {VehiclePageComponent} from './pages/vehicle/vehicle-page.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: 'vehicles/:vehicleId',
        loadComponent: () => import('./pages/vehicle/vehicle-page.component').then(m => m.VehiclePageComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
