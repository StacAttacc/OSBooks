import { Routes } from '@angular/router';
import { TaxRates } from './pages/tax-rates/tax-rates';

export const routes: Routes = [
  { path: '', component: TaxRates },
  { path: '**', redirectTo: '' },
];
