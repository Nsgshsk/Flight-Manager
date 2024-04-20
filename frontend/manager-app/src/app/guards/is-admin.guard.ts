import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise((resolve) => {
    const user = authService.getUserInfo();
    if (!!user) resolve(user.is_admin);
    else {
      router.navigate(['admin', 'dashboard']);
      resolve(false);
    }
  });
};
