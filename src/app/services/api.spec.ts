import { TestBed } from '@angular/core/testing';
import { ApiService } from './api'; // memakai shim 'api' yang re-export ApiService

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
