import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { TokenPair } from './../../models/token-pair';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BrowserStorageService } from './browser-storage.service';

const secretKey = environment.secretKey;

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor(private storage: BrowserStorageService) {}

  setTokenPair(token: TokenPair) {
    this.setTokenAccess(token.access);
    this.setTokenRefresh(token.refresh);
  }

  getTokenAccess() {
    return this.storage.getItem('access');
  }

  getTokenRefresh() {
    return this.storage.getItem('refresh');
  }

  private setTokenAccess(access: string) {
    this.storage.setItem('access', access);
  }

  private setTokenRefresh(refresh: string) {
    this.storage.setItem('refresh', refresh);
  }

  clearTokens() {
    this.storage.clear();
  }
}
