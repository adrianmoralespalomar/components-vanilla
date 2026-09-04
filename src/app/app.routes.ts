import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'form-controls',
    loadChildren: () => import('./zzz-test-components/form-controls/form-controls-test.routes').then(m => m.formControlsTestRoutes)
  }
];
