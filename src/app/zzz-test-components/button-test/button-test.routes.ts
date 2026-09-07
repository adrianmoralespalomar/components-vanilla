import { Routes } from '@angular/router';
import { ButtonTestComponent } from './button-test.component';

export const buttonTestRoutes: Routes = [
  {
    path: '',
    component: ButtonTestComponent,
    children: []
  }
];
