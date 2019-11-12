import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEventosPage } from './mis-eventos.page';

describe('MisEventosPage', () => {
  let component: MisEventosPage;
  let fixture: ComponentFixture<MisEventosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisEventosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisEventosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
