import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Volunteer } from '../models/volunteer.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage  {
  volunteer = {} as Volunteer;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firstore: AngularFirestore
  ) { }

  async createVolunteer(volunteer: Volunteer) {
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'PLease Wait...'
      });
      (await loader).present();

      try {
        await this.firstore.collection("volunteers").add(volunteer);
      } catch (e) {
        this.showToast("Enter Email");
      }

      //dismiss loader
      (await loader).dismiss();
      this.navCtrl.navigateRoot("home");
    }
  }

  formValidation() {
    if (!this.volunteer.fullname) {
      this.showToast(" Please enter your fullname");
      return false;
    }
    if (!this.volunteer.location) {
      this.showToast("please enter the office you want to volunteer in ");
      return false;
    }
    if (!this.volunteer.mobile) {
      this.showToast("Please enter your mobile number ");
      return false;
    }

    if (!this.volunteer.position) {
      this.showToast("Select the event you want to volunteer as");
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
