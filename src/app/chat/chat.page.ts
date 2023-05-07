import { Component} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  title = 'chat';
  email = 'user.email';
  form!: FormGroup;
  username = '';
  message = '';
  chats: Chat[] = [];

  db = getDatabase(initializeApp(environment.FIREBASE_CONFIG));

  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit(): void {
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      const chats: Chat[] = Object.values(data);
      this.chats.push(...chats);
    });
    this.form = this.formBuilder.group({
      'message': [],
      'username': []
    });
  }

  onChatSubmit(form: any): void {
    const chat: Chat = {
      ...form,
      timestamp: new Date().toString(),
      id: uuidv4(),
    };
    const chatRef = push(ref(this.db, 'chats'));
    set(chatRef, chat);
    this.form = this.formBuilder.group({
      'message': [],
      'username': [chat.username],
    });
  }
}
