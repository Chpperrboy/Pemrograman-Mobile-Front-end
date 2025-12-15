import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FactoriesPage } from './factories.page';

describe('FactoriesPage', () => {
  let component: FactoriesPage;
  let fixture: ComponentFixture<FactoriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
