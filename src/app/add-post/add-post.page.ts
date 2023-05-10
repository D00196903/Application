import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Event } from '../models/event.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage {
  event = {} as Event;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firstore: AngularFirestore
  ) { }

  async createEvent(event: Event) {
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'PLease Wait...'
      });
      (await loader).present();

      try {
        await this.firstore.collection("events").add(event);
      } catch (e) {
        this.showToast("Enter Email");
      }

      //dismiss loader
      (await loader).dismiss();
      this.navCtrl.navigateRoot("show");
    }
  }

  formValidation() {
    if (!this.event.title) {
      this.showToast("Enter event title");
      return false;
    }
    if (!this.event.location) {
      this.showToast("Enter event location");
      return false;
    }

    if (!this.event.details) {
      this.showToast("Enter event details");
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
