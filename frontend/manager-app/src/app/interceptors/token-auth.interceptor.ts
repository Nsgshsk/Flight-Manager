import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/authentication/auth.service';
import { TokenStorageService } from '../services/authentication/token-storage.service';

const apiPaths = []

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

    // If the user is logged in and the request is to the API URL, add the Authorization header
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !request.url.includes('auth/token/') && error.status === 401) {
        return this.handle401Error(request, next);
      }

      return throwError(() => error);
    })) as Observable<HttpEvent<any>>;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (!this.auth.isTokenRefreshExpired()){
        this.auth.refreshToken();
        if (!this.auth.isTokenAccessExpired()){
          const token = this.tokenStorage.getTokenAccess();
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return next.handle(request);
        }
      }
      return throwError(() => new Error())


        return this.auth.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.tokenService.saveToken(token.accessToken);
            this.refreshTokenSubject.next(token.accessToken);
            
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            
            this.auth.logoutToken();
            return throwError(() => err);
          })
        );
    }
  }
}
