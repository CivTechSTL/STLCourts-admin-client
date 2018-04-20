import { TestBed, getTestBed } from '@angular/core/testing';

import { JwtService } from './jwt.service';


describe('JwtService', () => {
  let injector;
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtService]
    });
    injector = getTestBed();
    service = injector.get(JwtService);
  });

  it('should be created',  () => {
    expect(service).toBeTruthy();
  });

  it ('sets and gets token', () => {
    let token: string = service.getToken();
    expect(token).toBe(null);
    service.setToken('123');
    token = service.getToken();
    expect(token).toEqual('123');
  });

  it ('sets and gets refreshToken', () => {
    let token: string = service.getRefreshToken();
    expect(token).toBe(null);
    service.setRefreshToken('123');
    token = service.getRefreshToken();
    expect(token).toEqual('123');
  });

  it ('clears tokens', () => {
    service.setToken('ABC');
    service.setRefreshToken('123');
    service.clearTokens();
    const token: string = service.getToken();
    const refreshToken: string = service.getRefreshToken();
    expect(token).toBe(null);
    expect(refreshToken).toBe(null);
  });
});
