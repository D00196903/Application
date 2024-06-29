import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/UserService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private userService: UserService, private router: Router) {}

  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error: unknown) => { // Explicitly declaring 'unknown' type for error
      console.error('Logout failed', error);
    });
  }
}
