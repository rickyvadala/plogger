import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosCondicionesPage } from './terminos-condiciones.page';

describe('TerminosCondicionesPage', () => {
  let component: TerminosCondicionesPage;
  let fixture: ComponentFixture<TerminosCondicionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosCondicionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosCondicionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
