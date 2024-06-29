import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

/**
 * Component for handling password recovery functionality.
 */
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  email = '';
  password = '';
  error = '';
  username = '';

  /**
   * Constructor for ForgotPage.
   * 
   * @param fireauth - AngularFireAuth for Firebase authentication operations.
   * @param router - Angular router for navigation.
   * @param toastController - Controller for displaying toasts.
   * @param loadingController - Controller for displaying loading indicators.
   * @param alertController - Controller for displaying alerts.
   */
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) { }

  /**
   * OnInit lifecycle hook.
   */
  ngOnInit() { }

  /**
   * Opens a loading indicator.
   */
  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }

  /**
   * Closes the loading indicator.
   */
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  /**
   * Handles password recovery process.
   */
  async recover() {
    await this.openLoader(); // Show loader
    this.fireauth.sendPasswordResetEmail(this.email)
      .then(() => {
        this.closeLoading(); // Hide loader
        this.presentToast('Password reset email sent', 'bottom', 1000);
        this.router.navigateByUrl('/login');
      })
      .catch(err => {
        this.closeLoading(); // Hide loader
        this.presentAlert(err.message); // Show error in an alert
      });
  }
  
  /**
   * Displays an alert with the specified message.
   * 
   * @param message - The message to display in the alert.
   */
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  /**
   * Displays a toast with the specified message, position, and duration.
   * 
   * @param message - The message to display in the toast.
   * @param position - The position of the toast.
   * @param duration - The duration of the toast in milliseconds.
   */
  async presentToast(message: string, position: 'top' | 'bottom' | 'middle' | undefined, duration: number) {
    const toast = await this.toastController.create({
      message,
      duration,
      position
    });
    toast.present();
  }
}
