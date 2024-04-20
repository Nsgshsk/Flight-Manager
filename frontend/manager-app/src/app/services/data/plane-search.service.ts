import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Plane } from '../../models/plane';
import { catchError, retry, throwError } from 'rxjs';

const apiUrl = environment.apiUrl;
const apiPath = apiUrl + 'api/flights/planes/search/';

@Injectable({
  providedIn: 'root'
})
export class PlaneSearchService {
  constructor(private http: HttpClient) {}

  getPlaneList() {
    return this.http.get<Plane[]>(apiPath).pipe(
      retry(3),
      catchError((error) => throwError(() => error))
    );
  }
}
