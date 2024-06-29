import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { UserService } from '../services/UserService';
import { io } from 'socket.io-client'; // Import socket.io-client

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: User = {} as User;
  private socket: any; // Declare socket variable

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private router: Router,
    private userService: UserService
  ) {
    this.socket = io('http://localhost:3000'); // Initialize socket connection
  }

  ngOnInit() {
    // Any initialization if needed
  }

  async login(user: User) {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      await loader.present();

      try {
        const result = await this.afAuth.signInWithEmailAndPassword(user.email!, user.password!);
        console.log('Login successful');

        const currentUser: User = {
          id: result.user?.uid!,
          email: result.user?.email!,
          displayName: result.user?.displayName || result.user?.email!.split('@')[0] || 'Anonymous',
          status: 'available', // Default status
          online: true, // Set user as online
          username: result.user?.email!.split('@')[0] || 'Anonymous' // Use email prefix as username
        };

        this.userService.setCurrentUser(currentUser);

        // Emit login event
        this.socket.emit('login', { username: currentUser.displayName });

        this.navCtrl.navigateRoot('/chat-rooms');
      } catch (e) {
        this.showToast('Login failed. Please check your credentials.');
      }

      await loader.dismiss();
    }
  }

  formValidation() {
    if (!this.user.email) {
      this.showToast('Enter email');
      return false;
    }

    if (!this.user.password) {
      this.showToast('Enter password');
      return false;
    }
    return true;
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Login successful:', result.user);

      const currentUser: User = {
        id: result.user?.uid!,
        email: result.user?.email!,
        displayName: result.user?.displayName || result.user?.email!.split('@')[0] || 'Anonymous',
        status: 'available', // Default status
        online: true, // Set user as online
        username: result.user?.email!.split('@')[0] || 'Anonymous' // Use email prefix as username
      };

      this.userService.setCurrentUser(currentUser);

      this.socket.emit('login', { username: currentUser.displayName });

      this.router.navigate(['/buttons']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async loginWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Login successful:', result.user);

      const currentUser: User = {
        id: result.user?.uid!,
        email: result.user?.email!,
        displayName: result.user?.displayName || result.user?.email!.split('@')[0] || 'Anonymous',
        status: 'available', // Default status
        online: true, // Set user as online
        username: result.user?.email!.split('@')[0] || 'Anonymous' // Use email prefix as username
      };

      this.userService.setCurrentUser(currentUser);

      this.socket.emit('login', { username: currentUser.displayName });

      this.router.navigate(['/chat-rooms']);
    } catch (error: unknown) {
      console.error('Login failed:', error);
      this.handleError(error, 'Login failed');
    }
  }

  private handleError(error: unknown, message: string) {
    if (error instanceof Error) {
      this.showToast(`${message}: ${error.message}`);
    } else {
      this.showToast(message);
    }
  }

  forgot(email: string | null) {
    if (email) {
      this.router.navigate(['/forgot'], { queryParams: { email: email } });
    } else {
      this.showToast('Please enter a valid email address.');
    }
  }
}
