import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Roster } from '../models/roster.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-roster',
  templateUrl: './add-roster.page.html',
  styleUrls: ['./add-roster.page.scss'],
})
export class AddRosterPage {
  roster = {} as Roster;
  rosters: any;
  id: any;
  formatteddate!: string;
  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private firstore: AngularFirestore
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
  }
  async createRoster(roster: Roster) {
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'PLease Wait...'
      });
      (await loader).present();

      try {
        //await this.firstore.collection("rosters").add(roster);
        console.log(JSON.stringify(roster))
        this.formatteddate = this.formatdate(roster.date)
        await this.firstore.collection("roster").doc(this.formatteddate).collection("rosters").add(roster)
      } catch (e) {
        this.showToast("Enter Email");
      }

      //dismiss loader
      (await loader).dismiss();
      this.navCtrl.navigateRoot("buttons");
    }
  }

  formValidation() {
    if (!this.roster.fullname) {
      this.showToast("Enter fullname");
      return false;
    }
    if (!this.roster.office) {
      this.showToast("Enter office");
      return false;
    }

    if (!this.roster.position) {
      this.showToast("Enter position");
      return false;
    }

    if (!this.roster.time) {
      this.showToast("Enter time");
      return false;
    }


    if (!this.roster.date) {
      this.showToast("Enter date");
      return false;
    }
    return true;
  }

  ionViewWillEnter() {
    this.getRoster();
  }

  async getRoster() {
    // show loader
    let loader = await this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    loader.present();

    try {
      this.firstore
        .collection<Roster>("rosters")
        .snapshotChanges()
        .subscribe(data => {
          this.rosters = data.map(e => {
            return {
              id: e.payload.doc.id,
              // title: e.payload.doc.data(),
              // details: e.payload.doc.data()
              fullname: e.payload.doc.data().fullname,
              date: e.payload.doc.data().date,
              office: e.payload.doc.data().office,
              position: e.payload.doc.data().position,
              time: e.payload.doc.data().time
            };
          });
          //dismiss  loader
          loader.dismiss();
        });

    } catch (e) {
      this.showToast("Enter Email");
    }
  }

  async deleteRoster(id: string) {
    // show loader
    let loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    await this.firstore.doc("rosters/" + id).delete();

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
  formatdate(Date: any) {
    return Date.split('T')[0];
  }
}
