import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from 'aesy-components';

@Component({
  selector: 'aesy-button-test',
  imports: [RouterModule, ButtonComponent, JsonPipe],
  template: `
    <div style="display: grid;grid-template-columns: repeat(6, 1fr); gap:1rem;margin:1rem 0">
      <aesy-button [label]="'Primary'" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Primary disabled'" [disabled]="true" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Secondary'" [type]="'secondary'" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Secondary disabled'" [type]="'secondary'" [disabled]="true" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Tertiary'" [type]="'tertiary'" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Tertiary disabled'" [type]="'tertiary'" [disabled]="true" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Success'" [type]="'success'" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Success disabled'" [type]="'success'" [disabled]="true" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Info'" [type]="'info'" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Info disabled'" [type]="'info'" [disabled]="true" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Warning'" [type]="'warning'" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Warning disabled'" [type]="'warning'" [disabled]="true" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Danger'" [type]="'danger'" (buttonClick)="showEvent($event)" />
      <aesy-button [label]="'Danger disabled'" [type]="'danger'" [disabled]="true" (buttonClick)="showEvent($event)" />
    </div>
    <pre>{{ event | json }}</pre>

    <router-outlet />
  `
})
export class ButtonTestComponent {
  event: Event | null = null;

  showEvent(event: PointerEvent) {
    this.event = event;
  }
}
