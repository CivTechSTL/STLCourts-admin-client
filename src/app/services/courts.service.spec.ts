import { TestBed, inject } from '@angular/core/testing';

import { CourtsService } from './courts.service';

describe('CourtsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourtsService]
    });
  });

  it('should be created', inject([CourtsService], (service: CourtsService) => {
    expect(service).toBeTruthy();
  }));
});
