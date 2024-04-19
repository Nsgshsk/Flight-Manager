import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorageService } from '../services/authentication/token-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const jwtHellper = inject(JwtHelperService);
  const tokenStorage = inject(TokenStorageService);

  return new Promise<boolean>((resolve) => {
    if (authService.isTokenAccessExpired()) {
      if (authService.isTokenRefreshExpired()) {
        router.navigate(['login']);
        resolve(false);
      } else {
        const isRefreshed = authService.refreshToken();
        isRefreshed.then((result) => {
          if (!result) router.navigate(['login']);
          resolve(result);
        });
      }
    } else resolve(true);
  });
};
