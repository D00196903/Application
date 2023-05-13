import { Component, OnInit } from '@angular/core';
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
export class ChatPage implements OnInit {
  title = 'chat';
  email = 'user.email';
  form!: FormGroup;
  username = '';
  message = '';
  chats: Chat[] = [];

  db = getDatabase(initializeApp(environment.FIREBASE_CONFIG));

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chats: Chat[] = Object.values(data);
        for (const chat of chats) {
          chat.message = await this.decryptMessage(chat.message);
        }
        this.chats = [...chats];
      }
    });
    this.form = this.formBuilder.group({
      message: [],
      username: [],
    });
  }

  async onChatSubmit() {
    const encryptedMessage = await this.encryptMessage(this.form.value.message);
    const chat: Chat = {
      ...this.form.value,
      message: encryptedMessage,
      timestamp: new Date().toString(),
      id: uuidv4(),
    };
    const chatRef = push(ref(this.db, 'chats'));
    set(chatRef, chat);
    this.form = this.formBuilder.group({
      message: [],
      username: [chat.username],
    });
  }

  async encryptMessage(message: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(environment.FIREBASE_ENCRYPTION_SECRET.slice(0, 16)),
      { name: 'AES-GCM', length: 128 },
      true,
      ['encrypt', 'decrypt']
    );
    const encryptedMessage = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedMessage
    );
    const encrypted = new Uint8Array(iv.length + encryptedMessage.byteLength);
    encrypted.set(iv);
    encrypted.set(new Uint8Array(encryptedMessage), iv.length);
    return btoa(String.fromCharCode(...encrypted));
  }
  async decryptMessage(encryptedMessage: string): Promise<string> {
    // Convert the input encryptedMessage string from base64 to a Uint8Array.
    const encrypted = new Uint8Array(atob(encryptedMessage).split('').map(char => char.charCodeAt(0)));
  
    // Extract the initialization vector (IV) from the first 12 bytes of the encrypted message.
    const iv = encrypted.slice(0, 12);
  
    // Import the encryption key from a string literal environment.FIREBASE_ENCRYPTION_SECRET (which is sliced to 16 characters) using the Web Crypto API.
    const key = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(environment.FIREBASE_ENCRYPTION_SECRET.slice(0, 16)),
      { name: 'AES-GCM', length: 128 },
      true,
      ['encrypt', 'decrypt']
    );
  
    // Extract the encrypted content from the remaining bytes of the encrypted message.
    const encryptedContent = encrypted.slice(12);
  
    // Decrypt the encrypted content using the imported key and the IV using the Web Crypto API.
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedContent
    );
  
    // Decode the decrypted content to a string using the TextDecoder API.
    const decryptedMessage = new TextDecoder().decode(decryptedContent);
  
    // Return the decrypted message as a string.
    return decryptedMessage;
  }
}  
   
