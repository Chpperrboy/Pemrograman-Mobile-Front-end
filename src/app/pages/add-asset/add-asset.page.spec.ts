import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAssetPage } from './add-asset.page';

describe('AddAssetPage', () => {
  let component: AddAssetPage;
  let fixture: ComponentFixture<AddAssetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
