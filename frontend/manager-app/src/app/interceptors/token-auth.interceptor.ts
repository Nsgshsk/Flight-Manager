import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/authentication/auth.service';
import { TokenStorageService } from '../services/authentication/token-storage.service';
import { TokenPair } from '../models/token-pair';

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

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
    const isMandatory = !request.url.includes('auth/token');

    // If the user is logged in and the request is to the API URL, add the Authorization header
    if (isLoggedIn && isApiUrl && isMandatory) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !request.url.includes('auth/token') &&
          error.status === 401
        ) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.auth.refresh().pipe(
        switchMap((token: TokenPair) => {
          this.isRefreshing = false;

          this.tokenStorage.setTokenPair(token);

          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token.access}` },
          });

          return next.handle(request);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }
}
