import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenPair } from '../../models/token-pair';
import { User } from '../../models/user';
import { TokenStorageService } from './token-storage.service';
import { UserToken } from '../../models/user-token';
import { LoginForm } from '../../models/login-form';

const apiPaths = {
  login: '/api/token/',
  refresh: '/api/token/refresh/',
  logout: '/api/token/blacklist/',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userInfo: UserToken | null = null;

  constructor(
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  login(login: LoginForm) {
    return this.http.post<TokenPair>(apiPaths.login, login);
  }

  refresh() {
    let refresh: string = this.tokenStorage.getTokenRefresh()
    return this.http.post<TokenPair>(apiPaths.refresh, refresh)
  }

  logout() {
    this.userInfo = null
    this.tokenStorage.clearTokens()
  }

  setToken(login: LoginForm) {
    this.login(login).subscribe({
      next: (token) => {
        this.setUserInfo(token.access);
        this.tokenStorage.setTokenPair(token);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  setUserInfo(token: string) {
    this.userInfo = this.jwtHelper.decodeToken(token) as UserToken;
  }

  getUserInfo() {
    if (!this.userInfo) return null;
    return this.userInfo;
  }
}
