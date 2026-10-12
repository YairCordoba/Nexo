import { Routes } from '@angular/router';

// Cada vista se carga al navegar; los parámetros conservan los enlaces del catálogo.
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    title: 'Nexo Noticias - Quietly Thinking',
  },
  {
    path: 'noticias',
    loadComponent: () => import('./pages/news/news').then((m) => m.NewsComponent),
    title: 'Noticias - Nexo Noticias',
  },
  {
    path: 'detalle',
    loadComponent: () => import('./pages/detail/detail').then((m) => m.DetailComponent),
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favorites/favorites').then((m) => m.FavoritesComponent),
    title: 'Favoritos - Nexo Noticias',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactComponent),
    title: 'Contacto - Nexo Noticias',
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    title: 'Administración - Nexo Noticias',
  },
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
  {
    path: 'src/pages/:page',
    loadComponent: () => import('./pages/legacy-redirect').then((m) => m.LegacyRedirectComponent),
  },
  { path: '**', redirectTo: '' },
];
