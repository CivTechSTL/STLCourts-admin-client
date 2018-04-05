import { TestBed, inject } from '@angular/core/testing';

import { ApiPrivilegesService } from './api-privileges.service';

describe('ApiPrivilegesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiPrivilegesService]
    });
  });

  it('should be created', inject([ApiPrivilegesService], (service: ApiPrivilegesService) => {
    expect(service).toBeTruthy();
  }));
});
