import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/chat.model';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  roomName: string;
  form!: FormGroup;
  chats: Chat[] = [];
  currentUser: any;
  typingUsers: string[] = [];

  db = getDatabase(initializeApp(environment.FIREBASE_CONFIG));

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {
    this.roomName = this.route.snapshot.paramMap.get('roomName') || 'Default Room';
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Current user set in ChatPage:', this.currentUser);
  
      if (this.currentUser) {
        const username = this.currentUser.displayName || (this.currentUser.email ? this.currentUser.email.split('@')[0] : 'Anonymous');
        this.socketService.joinRoom({ username, room: this.roomName });
      }
    });
  
    this.form = this.formBuilder.group({
      message: [''],
      username: ['']
    });
  
    const chatsRef = ref(this.db, `chats/${this.roomName}`);
    onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chats: Chat[] = Object.values(data) as Chat[]; // Assert that data is of type Chat[]
        const decryptedChats = await Promise.all(chats.map(async (chat) => ({
          ...chat,
          message: await this.decryptMessage(chat.message)
        })));
        this.chats = decryptedChats;
      }
    });
  
    this.socketService.listen('message').subscribe(data => {
      if (data.room === this.roomName) {
        this.chats.push(data);
      }
    });
  
    this.socketService.listen('typing').subscribe(data => {
      this.updateTypingUsers(data.username, data.typing);
    });
  }
  

  async onChatSubmit() {
    if (!this.currentUser) {
      await this.showToast('User not logged in');
      return;
    }

    const message = this.form.value.message;
    if (message.trim()) {
      const encryptedMessage = await this.encryptMessage(message);
      const chat: Chat = {
        firstName: this.currentUser.displayName || 'Anonymous',
        username: this.currentUser.email.split('@')[0],
        message: encryptedMessage,
        timestamp: new Date().toISOString(),
        id: uuidv4(),
        roomName: this.roomName
      };

      const chatRef = push(ref(this.db, `chats/${this.roomName}`));
      await set(chatRef, chat);
      this.form.reset();

      this.socketService.emit('message', { text: message, room: this.roomName });
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  updateTypingUsers(username: string, typing: boolean) {
    if (typing) {
      if (!this.typingUsers.includes(username)) {
        this.typingUsers.push(username);
      }
    } else {
      this.typingUsers = this.typingUsers.filter(user => user !== username);
    }
  }

  onTyping() {
    if (this.currentUser) {
      this.socketService.emit('typing', { room: this.roomName, username: this.currentUser.username, typing: true });
    }
  }

  onStopTyping() {
    if (this.currentUser) {
      this.socketService.emit('typing', { room: this.roomName, username: this.currentUser.username, typing: false });
    }
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

