import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Airport } from '../../models/airport';

const apiPath = 'api/flights/airports/';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpClient) {}

  getAirportList() {
    return this.http.get<Airport[]>(apiPath);
  }
}
