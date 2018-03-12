import { TestBed, inject } from '@angular/core/testing';

import { ApiGoogleSignInService } from './api-google-sign-in.service';

describe('ApiGoogleSignInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiGoogleSignInService]
    });
  });

  it('should be created', inject([ApiGoogleSignInService], (service: ApiGoogleSignInService) => {
    expect(service).toBeTruthy();
  }));
});
