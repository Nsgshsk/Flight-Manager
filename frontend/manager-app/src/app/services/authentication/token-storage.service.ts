import { TokenPair } from './../../models/token-pair';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private tokenPair: TokenPair = {
    refresh: '',
    access: '',
  };

  constructor() {}

  getTokenPair() {
    return this.tokenPair;
  }

  setTokenPair(token: TokenPair) {
    this.setTokenAccess(token.access);
    this.setTokenRefresh(token.refresh);
  }

  getTokenAccess() {
    if (!this.tokenPair.access) throw new Error();
    return this.tokenPair.access;
  }

  getTokenRefresh() {
    if (!this.tokenPair.refresh)
      this.tokenPair.refresh = sessionStorage.getItem('refresh') || '';
    return this.tokenPair.refresh;
  }

  private setTokenAccess(access: string) {
    this.tokenPair.access = access;
  }

  private setTokenRefresh(refresh: string) {
    this.tokenPair.refresh = refresh;
    sessionStorage.setItem('refresh', refresh);
  }

  clearTokens() {
    this.tokenPair = {
      refresh: '',
      access: '',
    };
    sessionStorage.clear()
  }
}
