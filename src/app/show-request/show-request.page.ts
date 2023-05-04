import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Request } from '../models/request.model';

@Component({
  selector: 'app-show-request',
  templateUrl: './show-request.page.html',
  styleUrls: ['./show-request.page.scss'],
})
export class ShowRequestPage  {
  requests: any;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firstore: AngularFirestore
  ) { }
  ionViewWillEnter() {
    this.getRequests();
  }

  async getRequests() {
    // show loader
    let loader = await this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    loader.present();

    try {
      this.firstore
        .collection<Request>("requests")
        .snapshotChanges()
        .subscribe(data => {
          this.requests = data.map(e => {
            return {
              id: e.payload.doc.id,
              fullname: e.payload.doc.data().fullname,
              office: e.payload.doc.data().office,
              mobile: e.payload.doc.data().mobile,
              message: e.payload.doc.data().message,
              outcome: e.payload.doc.data().outcome
            };
          });
          //dismiss  loader
          loader.dismiss();
        });

    } catch (e) {
      this.showToast("Enter Email");
    }
  }

  async deleteRequest(id: string) {
    // show loader
    let loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    await this.firstore.doc("requests/" + id).delete();

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

