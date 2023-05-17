import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  user = {} as User;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private router: Router
  ) { }

  async login(user: User) {
    if (this.formValidation()) {
      // show loader
      let loader = await this.loadingCtrl.create({
        message: 'Please Wait...'
      });
      await loader.present();

      try {
        await this.afAuth.signInWithEmailAndPassword(user.email, user.password);
        console.log('Login successful');
        // redirect to home page
        this.navCtrl.navigateRoot('/buttons');
      } catch (e) {
        this.showToast('Enter Email');
      }

      //dismiss loader
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
    })
      .then(toastData => toastData.present());
  }
// this code snippet demonstrates a function that allows the user to log
// in using their Google account. It creates a Google authentication provider, 
//attempts to sign in the user using a popup authentication method, logs the
// success message and user information upon successful login, redirects the user 
//to the staff menu page, and handles any errors that may occur during the login process.
  async loginWithGoogle() {
    //creates a new instance of the GoogleAuthProvider class from the Firebase 
    //authentication library. It will be used to authenticate the user with Google.
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Login successful:', result.user);
      this.router.navigate(['/buttons']); // redirect to staff menu page
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
}
