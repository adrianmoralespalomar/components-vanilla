import { Routes } from '@angular/router';
import { CheckboxTestComponent } from './checkbox-test/checkbox-test.component';
import { FormControlsTestComponent } from './form-controls-test.component';
import { InputNumberTestComponent } from './input-number-test/input-number-test.component';
import { InputTextTestComponent } from './input-text-test/input-text-test.component';
import { RadioButtonTestComponent } from './radio-button-test/radio-button-test.component';
import { TextareaTestComponent } from './textarea-test/textarea-test.component';

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
      },
      {
        path: 'radio-button-test',
        component: RadioButtonTestComponent
      },
      {
        path: 'checkbox-test',
        component: CheckboxTestComponent
      },
      {
        path: 'textarea-test',
        component: TextareaTestComponent
      }
    ]
  }
];
