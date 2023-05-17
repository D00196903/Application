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
//This is asynchronous function named registerWithGoogle. 
//The async keyword indicates that the function will use await 
//to handle promises and will implicitly return a promise.
  async registerWithGoogle()
   {
    try {
      const user = await this.googleSignIn();
      //logs a success message to the console, indicating that the user has
      // been successfully registered with Google. It also displays the value of the user 
     //so now the user can login using their google account
      console.log('User successfully registered with Google:', user);

      // when the user sucessfully registers using google they will then be 
      //redirected to the login page where they can login 
      this.navCtrl.navigateRoot("login");

    } 
    //is executed if an error occurs within the try block. The error object is caught 
    //and stored in the error variable. It then logs an error message to the console, 
    //indicating that there was an error registering with Google, along with the error object itself.
    catch (error) 
    {
      console.error('Error registering with Google:', error);
    }
}

}
