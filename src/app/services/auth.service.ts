import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

/**
 * Service for handling user authentication.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  /**
   * Constructor for AuthService.
   * 
   * @param afAuth - AngularFireAuth for Firebase authentication operations.
   */
  constructor(private afAuth: AngularFireAuth) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const loggedInUser: User = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          status: '',
          online: false,
          username: ''
        };
        this.currentUserSubject.next(loggedInUser);
        this.setUserToLocalStorage(loggedInUser);
      } else {
        this.currentUserSubject.next(null);
        this.clearLocalStorage();
      }
    });
  }

  /**
   * Logs in the user.
   * 
   * @param user - The user object containing login details.
   */
  login(user: User) {
    this.currentUserSubject.next(user);
    this.setUserToLocalStorage(user);
  }

  /**
   * Logs out the current user.
   */
  logout() {
    this.afAuth.signOut().then(() => {
      this.currentUserSubject.next(null);
      this.clearLocalStorage();
    });
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
   * Saves the user to local storage.
   * 
   * @param user - The user object to save.
   */
  private setUserToLocalStorage(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Clears the user data from local storage.
   */
  private clearLocalStorage() {
    localStorage.removeItem('currentUser');
  }
}
