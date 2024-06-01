import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly storageKeyToken = 'employee-hub-token';
  readonly adminCredential = {
    email: 'admin@gmail.com',
    password: 'admin123',
  };

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  login(email: string, password: string) {
    if (
      email === this.adminCredential.email &&
      password === this.adminCredential.password
    ) {
      this.setTokenLogin();
      return true;
    } else {
      return false;
    }
  }

  setTokenLogin() {
    const token = this.storageKeyToken + new Date().getTime();
    localStorage.setItem(this.storageKeyToken, token);
  }

  isAuthenticated() {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.storageKeyToken);
    }
    return false;
  }

  getTokenLogin() {
    const token = localStorage.getItem(this.storageKeyToken);
    if (token) return token;
    return '';
  }
}
