import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { User } from "../models/user.model";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  user = {} as User;

  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private afAuth: AngularFireAuth,
              private navCtrl: NavController
  ) { }

  async register(user: User) {
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'Registering...'
      });
      (await loader).present();

      try {
        await this.afAuth
          .createUserWithEmailAndPassword(user.email, user.password)
          .then(data => {
            console.log(data);

            // redirect to home page
            this.navCtrl.navigateRoot("login");
          });
      } catch (e) {
        this.showToast("Enter Input");
      }

      //dismiss loader
      (await loader).dismiss();
    }
  }

  formValidation() {
    if (!this.user.email) {
      this.showToast("Enter email");
      return false;
    }

    if (!this.user.password) {
      this.showToast("Enter password");
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

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return credential.user;
  }

  async registerWithGoogle() {
    try {
      const user = await this.googleSignIn();
      console.log('User successfully registered with Google:', user);

      // Add your own logic here to save the user to your database 

      // Redirect to login page
      this.navCtrl.navigateRoot("login");

    } catch (error) {
      console.error('Error registering with Google:', error);
    }
}

}
