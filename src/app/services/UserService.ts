import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

/**
 * Service for managing user authentication and user state.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * BehaviorSubject to hold the current user state.
   */
  private currentUserSubject: BehaviorSubject<User | null>;

  /**
   * Observable for the current user state.
   */
  public currentUser: Observable<User | null>;

  /**
   * Constructor for UserService.
   * 
   * @param afAuth - AngularFireAuth for Firebase authentication.
   */
  constructor(private afAuth: AngularFireAuth) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Sets the current user and saves the user to local storage.
   * 
   * @param user - The user object to set as the current user.
   */
  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Retrieves the current user from local storage.
   * 
   * @returns The current user object or null if no user is found.
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Retrieves the user from local storage.
   * 
   * @returns The user object or null if no user is found.
   */
  private getUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Logs out the current user and clears the user state and local storage.
   * 
   * @returns A promise that resolves when the sign-out operation completes.
   */
  logout() {
    return this.afAuth.signOut().then(() => {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
    });
  }

  /**
   * Sets a nickname for the current user.
   * 
   * @param nickname - The nickname to set.
   * @throws An error indicating the method is not implemented.
   */
  setNickname(nickname: string) {
    throw new Error('Method not implemented.');
  }
}
