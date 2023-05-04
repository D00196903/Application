import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Office } from '../models/office.model';

@Component({
  selector: 'app-office',
  templateUrl: './office.page.html',
  styleUrls: ['./office.page.scss'],
})
export class OfficePage  {
  offices: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firstore: AngularFirestore
  ) { }
  ionViewWillEnter() {
    this.getOffices();
  }

  async getOffices() {
    // show loader
    let loader = await this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    loader.present();

    try {
      this.firstore
        .collection<Office>("offices")
        .snapshotChanges()
        .subscribe(data => {
          this.offices = data.map(e => {
            return {
              id: e.payload.doc.id,
              coordinator: e.payload.doc.data().coordinator,
              address: e.payload.doc.data().address,
              location: e.payload.doc.data().location,
              email: e.payload.doc.data().email,
              contact: e.payload.doc.data().contact,
            };
          });
          //dismiss  loader
          loader.dismiss();
        });

    } catch (e) {
      this.showToast("Enter Email");
    }
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    })
      .then(toastData => toastData.present());
  }

}

