import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopFollowComponent } from './pop-follow.component';

describe('PopFollowComponent', () => {
  let component: PopFollowComponent;
  let fixture: ComponentFixture<PopFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopFollowComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
