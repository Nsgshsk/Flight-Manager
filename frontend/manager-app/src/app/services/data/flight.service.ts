import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flight } from '../../models/flight';
import { FlightForm } from '../../models/flight-form';

const apiPath = 'api/flights/';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  constructor(private http: HttpClient) {}

  getFlightList(pageUrl: string) {
    return this.http.get<Flight[]>(pageUrl);
  }

  createFlight(flightForm: FlightForm) {
    return this.http.post(apiPath, flightForm);
  }

  getFlightInfo(id: number) {
    this.http.get<Flight>(apiPath + id + '/');
  }

  changeFlightInfo(flight: Flight) {
    return this.http.patch(apiPath + flight.id + '/', flight);
  }

  removeFlight(flight: Flight) {
    return this.http.delete(apiPath + flight.id + '/');
  }
}
