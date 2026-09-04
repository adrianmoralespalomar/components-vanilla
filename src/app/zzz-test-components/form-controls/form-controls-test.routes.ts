import { Routes } from '@angular/router';
import { FormControlsTestComponent } from './form-controls-test.component';
import { InputNumberTestComponent } from './input-number/input-number-test.component';
import { InputTextTestComponent } from './input-text-test/input-text-test.component';

export const formControlsTestRoutes: Routes = [
  {
    path: '',
    component: FormControlsTestComponent,
    children: [
      {
        path: 'input-text-test',
        component: InputTextTestComponent
      },
      {
        path: 'input-number-test',
        component: InputNumberTestComponent
      }
    ]
  }
];
