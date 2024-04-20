import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from '../models/event.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage {
  events: any[] = [];  // Initialized as an empty array


  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,  // Corrected spelling
    private authService: AuthService
  ) { }

  ionViewWillEnter() {
    this.getEvents();
  }

  async getEvents() {
    const loader = await this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    await loader.present();

    this.firestore
      .collection<Event>("events")
      .snapshotChanges()
      .subscribe(data => {
        this.events = data.map(e => ({
          id: e.payload.doc.id,
          title: e.payload.doc.data()?.title,  // Optional chaining if data might be undefined
          details: e.payload.doc.data()?.details,
          location: e.payload.doc.data()?.location
        }));
        loader.dismiss();
      }, error => {
        this.showToast("Error loading events");  // More accurate error message
        console.error("Error loading events:", error);
        loader.dismiss();
      });
  }

  async deleteEvent(id: string) {
    const loader = await this.loadingCtrl.create({
      message: 'Please Wait...'
    });
    await loader.present();

    try {
      await this.firestore.doc(`events/${id}`).delete();
      this.showToast("Event deleted successfully");
    } catch (error) {
      this.showToast("Error deleting event");
      console.error("Error deleting event:", error);
    } finally {
      loader.dismiss();
    }
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(toast => toast.present());
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }
}
