import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';

/**
 * Component for handling the registration page.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  user = {} as User;
  db = getDatabase(initializeApp(environment.FIREBASE_CONFIG));

  /**
   * Constructor for RegisterPage.
   * 
   * @param toastCtrl - Controller for displaying toasts.
   * @param loadingCtrl - Controller for displaying loading indicators.
   * @param afAuth - AngularFireAuth for Firebase authentication operations.
   * @param navCtrl - Navigation controller for routing.
   */
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  /**
   * Registers a new user with email and password.
   * 
   * @param user - The user object containing registration details.
   */
  async register(user: User) {
    if (this.formValidation()) {
      const loader = await this.loadingCtrl.create({
        message: 'Registering...'
      });
      await loader.present();

      try {
        if (!user.email || !user.password) {
          this.showToast('Email and password are required.');
          return;
        }

        const encryptedPassword = await this.encryptPassword(user.password);

        const userCredential = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
        const uid = userCredential.user?.uid;
        if (uid) {
          await set(ref(this.db, 'users/' + uid), {
            id: uid,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: encryptedPassword,
            displayName: user.displayName || 'Anonymous' // Ensure displayName is defined or set a default
          });
          this.navCtrl.navigateRoot('login');
        } else {
          this.showToast('Registration successful but no user ID found.');
        }
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
          this.showToast('Email already taken');
        } else {
          console.error('Error during registration:', e);
          this.showToast('Registration error: ' + (e.message || 'Unknown error'));
        }
      } finally {
        await loader.dismiss();
      }
    }
  }

  /**
   * Encrypts the user's password.
   * 
   * @param password - The password to encrypt.
   * @returns The encrypted password as a string.
   */
  async encryptPassword(password: string): Promise<string> {
    const encodedPassword = new TextEncoder().encode(password);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(environment.FIREBASE_ENCRYPTION_SECRET.slice(0, 16)),
      { name: 'AES-GCM', length: 128 },
      true,
      ['encrypt', 'decrypt']
    );
    const encryptedPassword = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedPassword
    );
    const encrypted = new Uint8Array(iv.length + encryptedPassword.byteLength);
    encrypted.set(iv);
    encrypted.set(new Uint8Array(encryptedPassword), iv.length);
    return btoa(String.fromCharCode(...encrypted));
  }

  /**
   * Logs in the user with Facebook authentication.
   */
  async loginWithFacebook() {
    const loader = await this.loadingCtrl.create({
      message: 'Logging in with Facebook...'
    });
    await loader.present();

    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      if (result.user) {
        await set(ref(this.db, 'users/' + result.user.uid), {
          id: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Anonymous'
        });
        this.navCtrl.navigateRoot('login');
      }
    } catch (error) {
      console.error('Error logging in with Facebook:', error);
      this.showToast('Error logging in with Facebook');
    } finally {
      await loader.dismiss();
    }
  }

  /**
   * Registers the user with Google authentication.
   */
  async registerWithGoogle() {
    const loader = await this.loadingCtrl.create({
      message: 'Registering with Google...'
    });
    await loader.present();

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      if (result.user) {
        await set(ref(this.db, 'users/' + result.user.uid), {
          id: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Anonymous'
        });
        this.navCtrl.navigateRoot('login');
      }
    } catch (error) {
      console.error('Error registering with Google:', error);
      this.showToast('Error registering with Google');
    } finally {
      await loader.dismiss();
    }
  }

  /**
   * Validates the registration form.
   * 
   * @returns A boolean indicating whether the form is valid.
   */
  formValidation() {
    if (!this.user.email) {
      this.showToast('Enter email');
      return false;
    }

    if (!this.user.password || !this.isStrongPassword(this.user.password)) {
      this.showToast('Enter a stronger password with 1 capital letter, symbols, and numbers');
      return false;
    }
    return true;
  }

  /**
   * Checks if the password is strong enough.
   * 
   * @param password - The password to check.
   * @returns A boolean indicating whether the password is strong.
   */
  isStrongPassword(password: string): boolean {
    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
    return strongRegex.test(password);
  }

  /**
   * Displays a toast message.
   * 
   * @param message - The message to display in the toast.
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
