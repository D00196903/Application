import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Request } from '../models/request.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage  {
  request = {} as Request;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firstore: AngularFirestore
  ) { }

  async createRequest(request: Request) {
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'PLease Wait...'
      });
      (await loader).present();

      try {
        await this.firstore.collection("requests").add(request);
      } catch (e) {
        this.showToast("Enter Email");
      }

      //dismiss loader
      (await loader).dismiss();
      this.navCtrl.navigateRoot("home");
    }
  }

  formValidation() {
    if (!this.request.fullname) {
      this.showToast("You need to enter your fullname");
      return false;
    }
    if (!this.request.office) {
      this.showToast("please enter an office you want to us to call you from");
      return false;
    }

    if (!this.request.message) {
      this.showToast("please leave a message");
      return false;
    }
    if (!this.request.outcome) {
      this.showToast("please fill in outcome");
      return false;
    }

    if (!this.request.mobile) {
      this.showToast("you need to enter a mobile number so we can call you back");
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

}
