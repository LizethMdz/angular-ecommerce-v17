import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes'),
  },

  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component'),
  },
  {
    path: 'administration-products',
    loadComponent: () => import('./features/admin-products/admin-products.component').then(adm => adm.AdminProductsComponent),
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products', pathMatch: 'full' },
];
