import {ApplicationConfig} from '@angular/core';

import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withInterceptors, withXsrfConfiguration} from "@angular/common/http";
import { authExpired } from './core/auth-expired.interceptor';
import { provideRouter, RoutesRecognized } from '@angular/router';
import { routes } from './app.route';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authExpired]),
      withXsrfConfiguration(
        {cookieName: "XSRF-TOKEN", headerName: "X-XSRF-TOKEN"}),
    ),
    provideRouter(routes)
  ]
};
