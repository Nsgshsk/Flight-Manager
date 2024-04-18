import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { en_GB, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import enGB from '@angular/common/locales/en-GB';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

import { environment } from '../environments/environment';
import { BrowserStorageService } from './services/authentication/browser-storage.service';
import { TokenAuthInterceptor } from './interceptors/token-auth.interceptor';

const apiUrl = environment.apiUrl;

export function jwtOptionsFactory(storage: BrowserStorageService) {
  return {
    // tokenGetter: () => {
    //   return storage.getItem('access');
    // },
    // allowedDomains: [apiUrl],
    // disallowedRoutes: [
    //   apiUrl + 'api/auth/token/',
    //   apiUrl + 'api/auth/token/refresh/',
    //   apiUrl + 'api/flights/',
    //   apiUrl + 'api/flights/:id/',
    //   apiUrl + 'api/flights/airports/',
    //   apiUrl + 'api/flights/planetypes/',
    //   apiUrl + 'api/reservations/nationalities/',
    // ],
  };
}

registerLocaleData(enGB);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideNzI18n(en_GB),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenAuthInterceptor, multi: true },
    importProvidersFrom(
      JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [BrowserStorageService],
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
};
