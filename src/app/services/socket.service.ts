import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

/**
 * Service for handling socket communications.
 */
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  /**
   * Constructor for SocketService.
   * 
   * @param socket - Socket instance for handling socket.io communications.
   */
  constructor(private socket: Socket) {}

  /**
   * Listens for an event from the socket.
   * 
   * @param eventName - The name of the event to listen for.
   * @returns An Observable that emits the event data.
   */
  listen(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);
  }

  /**
   * Emits an event to the socket.
   * 
   * @param eventName - The name of the event to emit.
   * @param data - The data to send with the event.
   */
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  /**
   * Sets the username for the socket connection.
   * 
   * @param username - The username to set.
   */
  setUsername(username: string) {
    this.socket.emit('set-username', username);
  }

  /**
   * Joins a room on the socket.
   * 
   * @param data - An object containing the username and room name.
   */
  joinRoom(data: { username: string, room: string }) {
    this.socket.emit('join-room', data);
  }
}
