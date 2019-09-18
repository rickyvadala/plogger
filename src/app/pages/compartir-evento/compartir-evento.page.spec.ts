import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartirEventoPage } from './compartir-evento.page';

describe('CompartirEventoPage', () => {
  let component: CompartirEventoPage;
  let fixture: ComponentFixture<CompartirEventoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompartirEventoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartirEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
