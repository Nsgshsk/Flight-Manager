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
import { environment } from '../environments/environment';

const apiUrl = environment.apiUrl

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
          allowedDomains: [apiUrl],
          disallowedRoutes: [
            apiUrl + 'api/auth/token/',
            apiUrl + 'api/auth/token/refresh/',
            apiUrl + 'api/flights/',
            apiUrl + 'api/flights/:id/',
            apiUrl + 'api/flights/airports/',
            apiUrl + 'api/flights/planetypes/',
            apiUrl + 'api/reservations/nationalities/',
          ],
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
};
