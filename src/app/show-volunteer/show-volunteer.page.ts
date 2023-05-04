import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Volunteer } from '../models/volunteer.model';

@Component({
  selector: 'app-show-volunteer',
  templateUrl: './show-volunteer.page.html',
  styleUrls: ['./show-volunteer.page.scss'],
})
export class ShowVolunteerPage {
  volunteers: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firstore: AngularFirestore
  ) { }
  ionViewWillEnter() {
    this.getVolunteers();
  }

  async getVolunteers() {
    // show loader
    let loader = await this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    loader.present();

    try {
      this.firstore
        .collection<Volunteer>("volunteers")
        .snapshotChanges()
        .subscribe(data => {
          this.volunteers = data.map(e => {
            return {
              id: e.payload.doc.id,
              fullname: e.payload.doc.data().fullname,
              position: e.payload.doc.data().position,
              mobile: e.payload.doc.data().mobile,
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

  async deleteVolunteer(id: string) {
    // show loader
    let loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    await this.firstore.doc("volunteers/" + id).delete();

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

