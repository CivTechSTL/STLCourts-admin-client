import {TestBed, getTestBed} from '@angular/core/testing';

import { ApiPrivilegesService } from './api-privileges.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';

describe('ApiPrivilegesService', () => {
  let injector;
  let service: ApiPrivilegesService;
  let httpMock: HttpTestingController;

  const mockRole = {
    role: 'myRole'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiPrivilegesService]
    });

    injector = getTestBed();
    service = injector.get(ApiPrivilegesService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it( 'should get the privilege', () => {
    service.getUserPrivilege().subscribe( userPriviledge => {
      expect(userPriviledge.role).toEqual('myRole');
    });

    const req = httpMock.expectOne(environment.baseUrl + '/privileges');
    expect(req.request.method).toBe('GET');
    req.flush(mockRole);
  });
});
