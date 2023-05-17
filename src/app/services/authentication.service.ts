import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  logout() {
    throw new Error('Method not implemented.');
  }
  constructor(private afAuth: AngularFireAuth) {}

  async getUserEmail(): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (user) {
      return user.email || '';
    } else {
      return '';
    }
  }
}
