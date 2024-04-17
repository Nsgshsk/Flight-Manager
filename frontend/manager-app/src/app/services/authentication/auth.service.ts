import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenPair } from '../../models/token-pair';
import { TokenStorageService } from './token-storage.service';
import { UserToken } from '../../models/user-token';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiUrl;
const apiPaths = {
  login: apiUrl + 'api/token/',
  refresh: apiUrl + 'api/token/refresh/',
  logout: apiUrl + 'api/token/blacklist/',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userInfo: UserToken | null = null;

  constructor(
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  private login(login: Partial<{ username: string; password: string }>) {
    return this.http.post<TokenPair>(apiPaths.login, login);
  }

  private refresh() {
    let refresh: string = this.tokenStorage.getTokenRefresh();
    return this.http.post<TokenPair>(apiPaths.refresh, refresh);
  }

  private logout() {
    let refresh: string = this.tokenStorage.getTokenRefresh();
    return this.http.post(apiPaths.refresh, refresh);
  }

  loginToken(login: Partial<{ username: string; password: string }>) {
    let result = false;
    this.login(login).subscribe({
      next: (token) => {
        this.setTokenAndUserInfo(token);
        result = true;
      },
      error: (err) => {
        console.error(err);
      },
    });
    return result;
  }

  refreshToken() {
    this.refresh().subscribe({
      next: (token) => this.setTokenAndUserInfo(token),
      error: (err) => {
        console.error(err);
      },
    });
  }

  logoutToken() {
    this.logout().subscribe({
      next: () => this.clearTokenAndUserInfo(),
      error: (err) => {
        console.error(err);
      },
    });
  }

  getUserInfo() {
    return this.userInfo;
  }

  isTokenAccessExpired() {
    let access = this.tokenStorage.getTokenAccess();
    return this.jwtHelper.isTokenExpired(access);
  }

  isTokenRefreshExpired() {
    let refresh = this.tokenStorage.getTokenRefresh();
    return this.jwtHelper.isTokenExpired(refresh);
  }

  private setTokenAndUserInfo(token: TokenPair) {
    this.setUserInfo(token.access);
    this.tokenStorage.setTokenPair(token);
  }

  private setUserInfo(token: string) {
    this.userInfo = this.jwtHelper.decodeToken(token) as UserToken;
  }

  private clearTokenAndUserInfo() {
    this.userInfo = null;
    this.tokenStorage.clearTokens();
  }
}
