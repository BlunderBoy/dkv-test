import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class BackendService {
    /*
    * Provides the url of the backend server.
    * Could be extended to handle config loading for different environments.
    * */
    public readonly backendUrl = 'http://localhost:3000';
}
