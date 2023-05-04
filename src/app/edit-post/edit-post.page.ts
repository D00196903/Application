import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Event} from '../models/event.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
  event = {} as Event;
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
    this.getEventById(this.id);
  }

  async getEventById(id: string) {
    // show loader
    let loader = this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    (await loader).present();

    this.firstore.doc<Event>("events/" + id)
      .valueChanges()
      .subscribe(data => {
        if (!data) return
        this.event.title = data["title"];
        this.event.details = data["details"];
        this.event.location = data["location"];
      });

    //dismiss  loader
    (await loader).dismiss();
  }

  async updateEvent(event: Event) {
    if (this.formValidation()) {
      // show loader
      let loader = this.loadingCtrl.create({
        message: 'PLease Wait...'
      });
      (await loader).present();

      try {
        console.log(event);
        const tmp = this.firstore.doc<Event>("events/" + this.id);
        console.log(tmp);
        tmp.update(event);
      } catch (e) {
        this.showToast("Enter Email");
      }

      //dismiss loader
      (await loader).dismiss();

      //redirect to home page
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
