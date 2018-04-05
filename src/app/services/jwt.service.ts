import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  token: string = null;
  refreshToken: string = null;
  userRole: string

  constructor() { }

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string {
    return this.token;
  }

  public setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  public getRefreshToken(): string {
    return this.refreshToken;
  }

  public clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
  }
}
