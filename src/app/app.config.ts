import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};

export const environment = {
  apiUrl: 'https://dns-prod-be.centralnode.lan/api/v1'
}
