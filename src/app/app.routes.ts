import { Routes } from '@angular/router';
import { InternosList } from './features/internos/views/internos-list/internos-list';
import { InternoCreateComponent } from './features/internos/views/internos-create/internos-create';
import { LoginComponent } from './features/auth/views/login/login';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'interno', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'interno',
    component: InternosList,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  { path: 'interno/create', component: InternoCreateComponent, canActivate: [AuthGuard] },
  { path: 'interno/edit/:id', component: InternoCreateComponent, canActivate: [AuthGuard] },
  { path: 'internos', redirectTo: 'interno', pathMatch: 'full' },
  { path: 'internos/create', redirectTo: 'interno/create', pathMatch: 'full' },
  { path: 'internos/edit/:id', redirectTo: 'interno/edit/:id' },
  { path: '**', redirectTo: 'interno' }
];
