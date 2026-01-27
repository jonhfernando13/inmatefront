import { Routes } from '@angular/router';
import { App } from './app';
import { InternosList } from './internos-list/internos-list';
import { InternoCreateComponent } from './internos-create/internos-create';

export const routes: Routes = [
  { path: '', redirectTo: 'internos', pathMatch: 'full' },
  { path: 'internos', component: InternosList,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange' // Cambiar a este valor
  },
  { path: 'internos/create', component: InternoCreateComponent },
];
