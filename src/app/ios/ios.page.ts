import { Roster } from './../models/roster.model';
import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { LoadingController,ToastController } from '@ionic/angular';
@Component({
  selector: 'app-ios',
  templateUrl: './ios.page.html',
  styleUrls: ['./ios.page.scss'],
})
export class IosPage {

  roster: any;
  selectedDate!: string | number | Date;
  data: any;
  db: any;
  formatdate!: Date;
  chosendate: any;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firstore: AngularFirestore  ) { }
  ionViewWillEnter() {
    this.getRosters();
  }

  async getRosters() {
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
          this.roster = data.map(e => {
            return {
              id: e.payload.doc.id,
              fullname: e.payload.doc.data().fullname,
              office: e.payload.doc.data().office
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
   async loadData() {
    // Convert selected date to a Firebase query

   //const selectedDate = new Date(this.selectedDate);
    //console.log(this.selectedDate);

  let formatteddate = this.formatteddate(this.selectedDate);
    console.log(formatteddate);


console.log("hello there: "+formatteddate);

    const query1 = this.firstore.collection("roster").doc(formatteddate.toString()).collection("rosters").get().subscribe((v)=> {
     this.chosendate = v.docs.map(item => item.data())
      console.log(this.chosendate)

    });


    //const query1 = await this.firstore.doc("roster/2023-03-18")//.collection('roster').get()
    //console.log("query1 " +query1)



  //console.log("query1 " + query1.forEach((queries)=> {console.log(queries)}))



    //const startOfDay = new Date(this.selectedDate.getFullYear(),selectedDate.getMonth(), selectedDate.getDate());
   // const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);




    //const query = await this.firstore.collection('roster').doc(this.formatteddate.toString()).collection("rosters").get();
    //const result = getDocs(query);
    //const query = this.firstore.collection('roster', ref => ref.where('timestamp', '>=', startOfDay).where('timestamp', '<', endOfDay));
    //console.log(query);
    //const result = query.subscribe();

  }


  formatteddate(Date: any) : Roster {
    return Date.split('T')[0];
  }


}