import { Injectable } from '@angular/core';
import io, { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

/**
 * Service for managing chat rooms and their users, now with real-time capabilities using Socket.IO.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  onUserChange() {
    throw new Error('Method not implemented.');
  }
  private socket: Socket;
  private rooms: { [key: string]: string[] } = {
    'room 1': [],
    'room 2': [],
    'room 3': [],
    'room 4': [],
    'room 5': []
  };

  constructor() {
    this.socket = io('http://localhost:3000');
  }

// In your ChatRoomService
joinRoom(room: string, user: string): boolean {
  // Assuming you have a logic to check if the room exists and is not full
  if (this.rooms[room] && this.rooms[room].length < 2) {
    this.rooms[room].push(user);
    return true; // Successfully added the user
  }
  return false; // Room is full or does not exist
}


  leaveRoom(room: string, user: string): void {
    this.rooms[room] = this.rooms[room].filter(u => u !== user);
    this.socket.emit('leave-room', { room, username: user });
  }

  getRoomUsers(room: string): string[] {
    return this.rooms[room];
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }

  sendMessage(room: string, message: string): void {
    this.socket.emit('message', { text: message, room });
  }
}
