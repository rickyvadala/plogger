import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersChatPage } from './users-chat.page';

describe('UsersChatPage', () => {
  let component: UsersChatPage;
  let fixture: ComponentFixture<UsersChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
