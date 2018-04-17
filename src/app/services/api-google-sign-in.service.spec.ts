import {TestBed, inject, getTestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ApiGoogleSignInService } from './api-google-sign-in.service';
import {environment} from '../../environments/environment';


describe('ApiGoogleSignInService', () => {
  let injector;
  let service: ApiGoogleSignInService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiGoogleSignInService]
    });

    injector = getTestBed();
    service = injector.get(ApiGoogleSignInService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should sign in', () => {
    const mockTokenResponse = {
      token: '123',
      refreshToken: '456'
    };

    service.googleSignIn('123').subscribe( tokenResponse => {
      expect(tokenResponse.token).toEqual('123');
      expect(tokenResponse.refreshToken).toEqual('456');
    });

    const req = httpMock.expectOne(environment.baseUrl + '/googleSignin');
    expect(req.request.method).toBe('POST');
    req.flush(mockTokenResponse);
  });
});
