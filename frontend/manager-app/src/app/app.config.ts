import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { en_GB, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import enGB from '@angular/common/locales/en-GB'
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenStorageService } from './services/authentication/token-storage.service';

export function tokenGetter() {
  let tokenStorage = inject(TokenStorageService);
  return tokenStorage.getTokenAccess();
}

registerLocaleData(enGB);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideNzI18n(en_GB),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['http://127.0.0.1:8000/'],
          disallowedRoutes: [
            'http://127.0.0.1:8000/api/auth/token/',
            'http://127.0.0.1:8000/api/auth/token/refresh/',
          ],
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
};
