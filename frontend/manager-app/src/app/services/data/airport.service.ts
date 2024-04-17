import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Airport } from '../../models/airport';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/flights/airports/';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpClient) {}

  getAirportList() {
    return this.http.get<Airport[]>(apiPath);
  }
}
