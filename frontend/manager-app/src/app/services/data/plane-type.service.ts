import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaneType } from '../../models/plane-type';

const apiPath = 'api/flights/planetypes/';

@Injectable({
  providedIn: 'root',
})
export class PlaneTypeService {
  constructor(private http: HttpClient) {}

  getPlaneTypeList() {
    return this.http.get<PlaneType[]>(apiPath);
  }
}
