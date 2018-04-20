import {getTestBed, TestBed} from '@angular/core/testing';

import { RefreshTokenService } from './refresh-token.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';
import {JwtService} from './jwt.service';


describe('RefreshTokenService', () => {
  let injector;
  let service: RefreshTokenService;
  let httpMock: HttpTestingController;

  const mockJwtService = {
    getRefreshToken: function() {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RefreshTokenService,
        {provide: JwtService, useValue: mockJwtService}]
    });

    injector = getTestBed();
    service = injector.get(RefreshTokenService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('gets new tokens', () => {
    const mockTokenResponse = {
      token: '123',
      refreshToken: '456'
    };

    service.refreshToken().subscribe( tokenResponse => {
      expect(tokenResponse.token).toEqual('123');
      expect(tokenResponse.refreshToken).toEqual('456');
    });

    const req = httpMock.expectOne(environment.baseUrl + '/refreshToken');
    expect(req.request.method).toBe('POST');
    req.flush(mockTokenResponse);
  });
});
