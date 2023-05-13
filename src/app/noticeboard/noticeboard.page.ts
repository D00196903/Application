import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Notice } from '../models/notice.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.page.html',
  styleUrls: ['./noticeboard.page.scss'],
})
export class NoticeboardPage {
  notices: Observable<Notice[]>;
  newNotice: Notice = new Notice();

  constructor(private firestore: AngularFirestore) {
    this.notices = this.firestore.collection<Notice>('noticeboard', ref => ref.orderBy('date', 'desc')).valueChanges();
  }

  addNotice() {
    this.newNotice.id = this.firestore.createId();
    this.firestore.collection('noticeboard').doc(this.newNotice.id).set(Object.assign({}, this.newNotice));
    this.newNotice = new Notice();
  }
}
