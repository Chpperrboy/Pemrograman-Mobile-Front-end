import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDepartmentPage } from './add-department.page';

describe('AddDepartmentPage', () => {
  let component: AddDepartmentPage;
  let fixture: ComponentFixture<AddDepartmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepartmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
