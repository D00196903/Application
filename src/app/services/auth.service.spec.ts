import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

/**
 * Unit tests for the AuthService.
 */
describe('AuthService', () => {
  let service: AuthService;

  /**
   * Sets up the TestBed and injects the AuthService before each test.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  /**
   * Test to check if the AuthService is created successfully.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
