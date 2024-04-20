import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = false;

  constructor() {}

  login() {
    this._isAuthenticated = true;
    localStorage.setItem('isAuthenticated', 'true');
    console.log('Logged in');
  }

  logout() {
    this._isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    console.log('Logged out');
  }

  get isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  
}

