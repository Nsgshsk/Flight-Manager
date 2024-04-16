import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nationality } from '../../models/nationality';

const apiPath = 'api/reservations/nationalities/';

@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  constructor(private http: HttpClient) {}

  getNationalityList() {
    return this.http.get<Nationality[]>(apiPath);
  }
}
