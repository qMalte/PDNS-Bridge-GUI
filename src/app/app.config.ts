import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HttpClientModule} from "@angular/common/http";
import {ZoneService} from "../services/zone.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};

export const environment = {
  apiUrl: 'http://localhost/api/v1'
}
