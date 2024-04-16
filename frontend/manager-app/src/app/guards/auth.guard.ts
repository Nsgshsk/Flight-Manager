import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let authService = inject(AuthService);

  if (!authService.isTokenAccessExpired()) {
    return true;
  } else {
    return new Promise((resolve) => {
      if (!authService.isTokenRefreshExpired()) {
        authService.refreshToken();
        if (authService.isTokenAccessExpired())
          setTimeout(() => {
            resolve(true);
          }, 200);
        else {
          router.navigate(['/login']);
          resolve(false);
        }
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  }
};
