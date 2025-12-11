import { Routes } from '@angular/router';
import {HomePage} from './pages/home/home-page.component';
import {VehiclePage} from './pages/vehicle/vehicle-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'vehicles/:id',
    component: VehiclePage
  },
  {
    path: '**',
    redirectTo: ''
  }
];
