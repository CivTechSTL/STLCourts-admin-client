import { TestBed, getTestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { JudgesService } from './judges.service';
import { environment} from '../../environments/environment';


describe('JudgesService', () => {
  let injector;
  let service: JudgesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JudgesService]
    });

    injector = getTestBed();
    service = injector.get(JudgesService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete', () => {
    const idToDelete = '4';

    service.delete(idToDelete);

    const req = httpMock.expectOne(environment.baseUrl + '/judges/' + idToDelete);
    expect(req.request.method).toBe('DELETE');
  });

  afterEach(() => {
    httpMock.verify();
  });

});
