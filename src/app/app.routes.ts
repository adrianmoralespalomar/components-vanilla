import { Routes } from '@angular/router';
import { SHOWCASE_ENTRIES } from './showcase/models/showcase-entries.const';

export const routes: Routes = [
  {
    path: '',
    title: 'Aesy components',
    loadComponent: () => import('./showcase/pages/home/home.component').then(m => m.HomeComponent)
  },
  ...SHOWCASE_ENTRIES.map(entry => ({
    path: `components/${entry.slug}`,
    title: `${entry.name} · Aesy components`,
    loadComponent: entry.loadPage
  })),
  {
    path: 'myotherstuff',
    loadComponent: () => import('./zzz-test-components/myotherstuff/myotherstuff.component').then(m => m.MyotherstuffComponent)
  },
  { path: '**', redirectTo: '' }
];
