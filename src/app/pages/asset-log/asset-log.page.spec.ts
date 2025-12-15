import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetLogPage } from './asset-log.page';

describe('AssetLogPage', () => {
  let component: AssetLogPage;
  let fixture: ComponentFixture<AssetLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
