import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.page.html',
  styleUrls: ['./buttons.page.scss'],
})
export class ButtonsPage implements OnInit {
  userEmail!: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loadUserEmail();
  }

  async loadUserEmail() {
    this.userEmail = await this.authService.getUserEmail();
  }

  async logout() {
    try {
      await this.authService.logout();
      this.navCtrl.navigateRoot('login');
    } catch (error) {
      console.log('Error logging out', error);
    }
  }
}
