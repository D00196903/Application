import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { mergeMapTo } from 'rxjs/operators';

/**
 * Service for handling Firebase Cloud Messaging (FCM).
 */
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  /**
   * Constructor for FcmService.
   * 
   * @param afMessaging - AngularFireMessaging for handling FCM.
   * @param afAuth - AngularFireAuth for Firebase authentication.
   */
  constructor(private afMessaging: AngularFireMessaging, private afAuth: AngularFireAuth) { }

  /**
   * Requests permission to receive FCM notifications.
   * Subscribes to the token stream and logs the token or an error.
   */
  requestPermission() {
    this.afAuth.authState.pipe(
      mergeMapTo(this.afMessaging.requestToken)
    ).subscribe(
      (token) => {
        console.log(token);
        // Save the token to your backend/database
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * Subscribes to the FCM messages stream and handles received messages.
   */
  receiveMessage() {
    this.afMessaging.messages.subscribe(
      (message) => {
        console.log(message);
        // Handle the received message
      });
  }
}
