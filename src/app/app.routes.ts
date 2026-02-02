import { Routes } from '@angular/router';
import { App } from './app';
import { InternosList } from './features/internos/views/internos-list/internos-list';
import { InternoCreateComponent } from './features/internos/views/internos-create/internos-create';

export const routes: Routes = [
  { path: '', redirectTo: 'internos', pathMatch: 'full' },
  { path: 'internos', component: InternosList, runGuardsAndResolvers: 'paramsOrQueryParamsChange' },
  { path: 'internos/create', component: InternoCreateComponent },
  { path: 'internos/edit/:id', component: InternoCreateComponent },
  { path: '**', redirectTo: 'internos' }
];
