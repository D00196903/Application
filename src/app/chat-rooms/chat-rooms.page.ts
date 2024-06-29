import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatRoomService } from '../services/chat-room.service';
import { User } from '../models/user.model';
import { UserService } from '../services/UserService';

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.page.html',
  styleUrls: ['./chat-rooms.page.scss'],
})
export class ChatRoomsPage implements OnInit {
  rooms: string[] = ['room 1', 'room 2', 'room 3', 'room 4', 'room 5'];
  currentUser: string | null = null;
  userCounts: { [key: string]: number } = {};

  constructor(
    private router: Router,
    private userService: UserService,
    private chatRoomService: ChatRoomService
  ) {}

  ngOnInit() {
    const user: User | null = this.userService.getCurrentUser();
    this.currentUser = user ? user.displayName ?? null : null;
  
    this.rooms.forEach(room => {
      this.userCounts[room] = this.chatRoomService.getRoomUsers(room).length;
    });
  }

  selectRoom(room: string) {
    if (this.currentUser) {
      const success = this.chatRoomService.joinRoom(room, this.currentUser);
      if (success) {
        this.router.navigate(['/chat', room]);
      } else {
        alert('Room is full');
      }
    } else {
      alert('No current user');
    }
  }

  getRoomUsers(room: string): string[] {
    return this.chatRoomService.getRoomUsers(room);
  }

  logout() {
    this.userService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error: any) => {
      console.error('Logout failed', error);
    });
  }
}
