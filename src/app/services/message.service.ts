// src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/chat.model';

/**
 * Service for handling chat messages.
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  db = getDatabase(initializeApp(environment.FIREBASE_CONFIG));

  /**
   * Sends a message from one user to another.
   * 
   * @param sender - The sender's username.
   * @param recipient - The recipient's username.
   * @param message - The content of the message.
   * @returns A Promise resolving with the reference to the pushed message.
   */
  sendMessage(sender: string, recipient: string, message: string) {
    const messagesRef = ref(this.db, `messages/${sender}_${recipient}`);
    return push(messagesRef, {
      sender,
      recipient,
      message,
      timestamp: Date.now(),
    });
  }

  /**
   * Retrieves messages for a given conversation.
   * 
   * @param conversationId - The ID of the conversation.
   * @param callback - A callback function to handle the retrieved messages.
   */
  getMessages(conversationId: string, callback: (messages: Chat[]) => void) {
    const messagesRef = ref(this.db, `messages/${conversationId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messages = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      callback(messages);
    });
  }

  /**
   * Deletes a specific message from a conversation.
   * 
   * @param conversationId - The ID of the conversation.
   * @param messageId - The ID of the message to delete.
   * @returns A Promise that resolves when the message is removed.
   */
  deleteMessage(conversationId: string, messageId: string) {
    const messageRef = ref(this.db, `messages/${conversationId}/${messageId}`);
    return remove(messageRef);
  }
}
