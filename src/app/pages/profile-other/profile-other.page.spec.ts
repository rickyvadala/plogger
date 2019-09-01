import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOtherPage } from './profile-other.page';

describe('ProfileOtherPage', () => {
  let component: ProfileOtherPage;
  let fixture: ComponentFixture<ProfileOtherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileOtherPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOtherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
