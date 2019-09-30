import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitarAmigosPage } from './invitar-amigos.page';

describe('InvitarAmigosPage', () => {
  let component: InvitarAmigosPage;
  let fixture: ComponentFixture<InvitarAmigosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitarAmigosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitarAmigosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
