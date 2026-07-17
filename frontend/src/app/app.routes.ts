import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employees } from './pages/employees/employees';
import { TaxRates } from './pages/tax-rates/tax-rates';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'employees', component: Employees },
  { path: 'tax-rates', component: TaxRates },
  { path: '**', redirectTo: '' }
];
