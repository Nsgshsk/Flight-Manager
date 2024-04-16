import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plane } from '../../models/plane';

const apiPath = 'api/flights/planes';

@Injectable({
  providedIn: 'root',
})
export class PlaneService {
  constructor(private http: HttpClient) {}

  getFlightList(pageUrl: string) {
    return this.http.get<Plane[]>(pageUrl);
  }

  createFlight(planeForm: Plane) {
    return this.http.post(apiPath, planeForm);
  }

  getFlightInfo(id: number) {
    this.http.get<Plane>(apiPath + id + '/');
  }

  changeFlightInfo(plane: Plane) {
    return this.http.patch(apiPath + plane.tail_number + '/', plane);
  }

  removeFlight(plane: Plane) {
    return this.http.delete(apiPath + plane.tail_number + '/');
  }
}
