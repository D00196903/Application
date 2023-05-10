import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage {
  events: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firstore: AngularFirestore
  ) { }
  ionViewWillEnter() {
    this.getEvents();
  }

  async getEvents() {
    // show loader
    let loader = await this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    loader.present();

    try {
      this.firstore
        .collection<Event>("events")
        .snapshotChanges()
        .subscribe(data => {
          this.events = data.map(e => {
            return {
              id: e.payload.doc.id,
              // title: e.payload.doc.data(),
              // details: e.payload.doc.data()
              title: e.payload.doc.data().title,
              details: e.payload.doc.data().details,
              location: e.payload.doc.data().location
            };
          });
          //dismiss  loader
          loader.dismiss();
        });

    } catch (e) {
      this.showToast("Enter Email");
    }
  }

  async deleteEvent(id: string) {
    // show loader
    let loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    await this.firstore.doc("events/" + id).delete();

    //dismiss  loader
    (await loader).dismiss();
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    })
      .then(toastData => toastData.present());
  }
}
