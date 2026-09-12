/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyotherstuffComponent } from './myotherstuff.component';

describe('MyotherstuffComponent', () => {
  let component: MyotherstuffComponent;
  let fixture: ComponentFixture<MyotherstuffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyotherstuffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyotherstuffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
