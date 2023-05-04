import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Request} from '../models/request.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.page.html',
  styleUrls: ['./edit-request.page.scss'],
})
export class EditRequestPage implements OnInit  {
request = {} as Request;
  id: any;
  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private firstore: AngularFirestore
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getRequestById(this.id);
  }

  async getRequestById(id: string) {
    // show loader
    let loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    this.firstore.doc<Request>("requests/" + id)
      .valueChanges()
      .subscribe(data => {
        if (!data) return
        this.request.fullname = data["fullname"];
        this.request.office = data["office"];
        this.request.mobile = data["mobile"];
        this.request.message = data["message"];
        this.request.outcome = data ["outcome"];
      });

    //dismiss  loader
    (await loader).dismiss();
  }

  async updateRequest(request: Request) {
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'PLease Wait...'
      });
      (await loader).present();

      try {
        console.log(request);
        const tmp = this.firstore.doc<Request>("requests/" + this.id);
        console.log(tmp);
        tmp.update(request);
      } catch (e) {
        this.showToast("Enter Email");
      }

      //dismiss loader
      (await loader).dismiss();

      //redirect to home page
      this.navCtrl.navigateRoot("show-request");
    }
  }

  formValidation() {
    if (!this.request.outcome) {
      this.showToast("please enter the outcome of this situation");
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
