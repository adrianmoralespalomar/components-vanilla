import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ComponentApi } from '../../models/component-api.interface';

@Component({
  selector: 'app-api-reference',
  imports: [NgTemplateOutlet],
  templateUrl: './api-reference.component.html',
  styleUrl: './api-reference.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiReferenceComponent {
  readonly api = input.required<ComponentApi>();
}
