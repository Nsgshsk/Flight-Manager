import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/authentication/auth.service';
import { TokenStorageService } from '../services/authentication/token-storage.service';

const apiPaths = []

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenStorage: TokenStorageService,
    private auth: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the current user's account information
    const token = this.tokenStorage.getTokenAccess();
    const isLoggedIn = !!this.tokenStorage.getTokenRefresh();
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    // If the user is logged in and the request is to the API URL, add the Authorization header
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request);
  }
}
