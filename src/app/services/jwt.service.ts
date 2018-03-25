import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  token: String = null;
  refreshToken: String = null;

  constructor() { }

  public setToken(token: String): void {
    this.token = token;
  }

  public getToken(): String {
    return this.token;
  }

  public setRefreshToken(token: String): void {
    this.refreshToken = token;
  }

  public getRefreshToken(): String {
    return this.refreshToken;
  }

  public clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
  }
}
