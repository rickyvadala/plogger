import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopLikesComponent } from './pop-likes.component';

describe('PopLikesComponent', () => {
  let component: PopLikesComponent;
  let fixture: ComponentFixture<PopLikesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopLikesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
