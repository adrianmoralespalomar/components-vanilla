import { Component } from '@angular/core';
import { InputNumberTestComponent } from './input-number/input-number-test.component';
import { InputTextTestComponent } from './input-text-test/input-text-test.component';

@Component({
  selector: 'app-form-controls-test',
  imports: [InputTextTestComponent, InputNumberTestComponent],
  template: `
    <!-- <app-input-text-test /> -->
    <app-input-number-test />
  `
})
export class FormControlsTestComponent {}
