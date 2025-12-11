import {Component, computed, inject, signal} from '@angular/core';
import {VehicleService} from '../../services/vehicle-service';
import {Vehicle} from '../../models/Vehicle.model';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePage {
  private vehicleService = inject(VehicleService);
  vehicles = signal<Vehicle[]>([]);
  mappedVehicles = computed(() => {
    return this.vehicles().map((vehicle) => {
        return {
          id: vehicle._id,
          data: JSON.stringify(vehicle)
        }
      }
    )
  });

  constructor() {
    this.vehicleService.getVehicles().subscribe((backendVehicles) => {
      this.vehicles.set(backendVehicles)
    })
  }
}
