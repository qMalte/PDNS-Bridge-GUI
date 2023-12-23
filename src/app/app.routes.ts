import { Routes } from '@angular/router';
import {DomainsComponent} from "./domains/domains.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'domains', component: DomainsComponent },
  { path: 'domain/:id', component: DomainsComponent },
];
