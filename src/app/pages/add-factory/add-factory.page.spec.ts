import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFactoryPage } from './add-factory.page';

describe('AddFactoryPage', () => {
  let component: AddFactoryPage;
  let fixture: ComponentFixture<AddFactoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFactoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
