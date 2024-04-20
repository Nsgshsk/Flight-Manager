import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaneType } from '../../models/plane-type';
import { environment } from '../../../environments/environment';
import { catchError, retry, throwError } from 'rxjs';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/flights/planetypes/';

@Injectable({
  providedIn: 'root',
})
export class PlaneTypeService {
  constructor(private http: HttpClient) {}

  getPlaneTypeList() {
    return this.http.get<PlaneType[]>(apiPath).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }
}
