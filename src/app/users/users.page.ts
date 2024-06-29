import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update, push, remove } from 'firebase/database';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { SocketService } from '../services/socket.service';

/**
 * Component for handling user interactions and managing user data.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: User[] = [];
  friends: User[] = [];
  friendRequests: User[] = [];
  friendRequestsSent: User[] = [];
  newMessages: { [key: string]: number } = {}; // New property for new messages
  newFriendRequestsCount: number = 0; // New property for friend request notifications
  db = getDatabase(initializeApp(environment.FIREBASE_CONFIG));
  currentUserId = 'currentUserId'; // Replace with the actual current user ID
  selectedUser: User | null = null; // Property to hold the user being edited
  isEditModalOpen: boolean = false; // Property to control the visibility of the edit modal

  /**
   * Constructor for UsersPage.
   */
  constructor(private socketService: SocketService) {}

  /**
   * OnInit lifecycle hook.
   * Initializes user data and fetches initial data from the database.
   */
  ngOnInit(): void {
    this.fetchUsers();
    this.fetchFriends();
    this.fetchFriendRequests();
    this.fetchFriendRequestsSent();
    this.fetchNewMessages();
    this.fetchNewFriendRequests();

    this.socketService.listen('user-status').subscribe((data: any) => {
      this.updateUserStatus(data);
    });

    this.socketService.emit('login', { username: 'musicfan451', status: 'available' }); // Example to emit login event on component initialization
  }

  /**
   * Updates the status of a user.
   */
  updateUserStatus(data: any) {
    const user = this.users.find(u => u.username === data.username);
    if (user) {
      user.status = data.status;
      user.online = data.online;
    } else {
      // If user is not found in the current list, handle accordingly (e.g., add the user)
    }
  }

  /**
   * Fetches all users from the database.
   */
  fetchUsers() {
    const usersRef = ref(this.db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.users = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
    });
  }

  /**
   * Fetches the current user's friends from the database.
   */
  fetchFriends() {
    const friendsRef = ref(this.db, `users/${this.currentUserId}/friends`);
    onValue(friendsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.friends = [];
        const friendIds = Object.keys(data);
        friendIds.forEach(friendId => {
          const friendRef = ref(this.db, `users/${friendId}`);
          onValue(friendRef, (friendSnapshot) => {
            const friendData = friendSnapshot.val();
            if (friendData) {
              this.friends.push({ id: friendId, ...friendData });
            }
          });
        });
      }
    });
  }

  /**
   * Fetches the current user's friend requests from the database.
   */
  fetchFriendRequests() {
    const requestsRef = ref(this.db, `users/${this.currentUserId}/friendRequests`);
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.friendRequests = [];
        const requestIds = Object.keys(data);
        requestIds.forEach(requestId => {
          const requestRef = ref(this.db, `users/${requestId}`);
          onValue(requestRef, (requestSnapshot) => {
            const requestData = requestSnapshot.val();
            if (requestData) {
              this.friendRequests.push({ id: requestId, ...requestData });
            }
          });
        });
      }
    });
  }

  /**
   * Fetches the current user's sent friend requests from the database.
   */
  fetchFriendRequestsSent() {
    const requestsSentRef = ref(this.db, `users/${this.currentUserId}/friendRequestsSent`);
    onValue(requestsSentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.friendRequestsSent = [];
        const requestSentIds = Object.keys(data);
        requestSentIds.forEach(requestSentId => {
          const requestSentRef = ref(this.db, `users/${requestSentId}`);
          onValue(requestSentRef, (requestSentSnapshot) => {
            const requestSentData = requestSentSnapshot.val();
            if (requestSentData) {
              this.friendRequestsSent.push({ id: requestSentId, ...requestSentData });
            }
          });
        });
      }
    });
  }

  /**
   * Fetches new messages for the current user from the database.
   */
  fetchNewMessages() {
    const messagesRef = ref(this.db, `messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach(key => {
          const messageThread = data[key];
          const unreadMessages = Object.keys(messageThread).filter(messageKey => !messageThread[messageKey].read && messageThread[messageKey].recipient === this.currentUserId);
          if (unreadMessages.length > 0) {
            const otherUserId = key.split('_').find(id => id !== this.currentUserId);
            if (otherUserId) {
              this.newMessages[otherUserId] = unreadMessages.length;
            }
          }
        });
      }
    });
  }

  /**
   * Fetches new friend requests for the current user from the database.
   */
  fetchNewFriendRequests() {
    const requestsRef = ref(this.db, `users/${this.currentUserId}/friendRequests`);
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.newFriendRequestsCount = Object.keys(data).length;
      }
    });
  }

  /**
   * Sends a friend request to another user.
   * 
   * @param friendId - The ID of the user to send a friend request to.
   */
  addFriend(friendId: string) {
    if (!friendId) return;
    const updates: any = {};
    updates[`users/${this.currentUserId}/friendRequestsSent/${friendId}`] = true;
    updates[`users/${friendId}/friendRequests/${this.currentUserId}`] = true;
    update(ref(this.db), updates);
  }

  /**
   * Cancels a friend request sent to another user.
   * 
   * @param friendId - The ID of the user to cancel the friend request for.
   */
  cancelFriendRequest(friendId: string) {
    if (!friendId) return;
    const updates: any = {};
    updates[`users/${this.currentUserId}/friendRequestsSent/${friendId}`] = null;
    updates[`users/${friendId}/friendRequests/${this.currentUserId}`] = null;
    update(ref(this.db), updates);
  }

  /**
   * Accepts a friend request from another user.
   * 
   * @param friendId - The ID of the user to accept the friend request from.
   */
  acceptFriendRequest(friendId: string) {
    if (!friendId) return;
    const updates: any = {};
    updates[`users/${this.currentUserId}/friends/${friendId}`] = true;
    updates[`users/${friendId}/friends/${this.currentUserId}`] = true;
    updates[`users/${this.currentUserId}/friendRequests/${friendId}`] = null;
    updates[`users/${friendId}/friendRequestsSent/${this.currentUserId}`] = null;
    update(ref(this.db), updates);
  }

  /**
   * Deletes a friend from the current user's friend list.
   * 
   * @param friendId - The ID of the user to remove from the friend list.
   */
  deleteFriend(friendId: string) {
    if (!friendId) return;
    const updates: any = {};
    updates[`users/${this.currentUserId}/friends/${friendId}`] = null;
    updates[`users/${friendId}/friends/${this.currentUserId}`] = null;
    update(ref(this.db), updates);
  }

  /**
   * Blocks a friend from the current user's friend list.
   * 
   * @param friendId - The ID of the user to block.
   */
  blockFriend(friendId: string) {
    if (!friendId) return;
    const updates: any = {};
    updates[`users/${this.currentUserId}/blocked/${friendId}`] = true;
    updates[`users/${friendId}/blockedBy/${this.currentUserId}`] = true;
    update(ref(this.db), updates);
  }

  /**
   * Checks if a user is a friend of the current user.
   * 
   * @param userId - The ID of the user to check.
   * @returns A boolean indicating if the user is a friend.
   */
  isFriend(userId: string): boolean {
    return this.friends.some(friend => friend.id === userId);
  }

  /**
   * Checks if a friend request has been sent to a user.
   * 
   * @param userId - The ID of the user to check.
   * @returns A boolean indicating if a friend request has been sent.
   */
  isFriendRequestSent(userId: string): boolean {
    return this.friendRequestsSent.some(request => request.id === userId);
  }

  /**
   * Checks if the current user has a friend request from a user.
   * 
   * @param userId - The ID of the user to check.
   * @returns A boolean indicating if the current user has a friend request from the user.
   */
  hasFriendRequest(userId: string): boolean {
    return this.friendRequests.some(request => request.id === userId);
  }

  /**
   * Sends a private message to another user.
   * 
   * @param userId - The ID of the user to send a message to.
   */
  sendPrivateMessage(userId: string) {
    const message = prompt('Enter your message:');
    if (message) {
      const messagesRef = ref(this.db, `messages/${this.currentUserId}_${userId}`);
      push(messagesRef, {
        sender: this.currentUserId,
        recipient: userId,
        message,
        timestamp: Date.now(),
        read: false
      });
    }
  }

  /**
   * Fetches private messages between the current user and another user.
   * 
   * @param userId - The ID of the user to fetch messages for.
   */
  fetchPrivateMessages(userId: string) {
    const messagesRef = ref(this.db, `messages/${this.currentUserId}_${userId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.keys(data).map(key => data[key]);
        console.log('Private Messages:', messages);
        alert(JSON.stringify(messages, null, 2)); // Display messages in an alert for simplicity
      } else {
        alert('No messages found');
      }
    });
  }

  /**
   * Opens the edit modal for a selected user.
   * 
   * @param user - The user to edit.
   */
  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditModalOpen = true;
  }

  /**
   * Closes the edit modal.
   */
  closeEditModal() {
    this.selectedUser = null;
    this.isEditModalOpen = false;
  }

  /**
   * Saves the updated user details to the database.
   */
  saveUserDetails() {
    if (this.selectedUser?.id) {
      const updates: any = {};
      updates[`users/${this.selectedUser.id}`] = { ...this.selectedUser };
      update(ref(this.db), updates).then(() => {
        this.closeEditModal();
        this.fetchUsers(); // Refresh the user list after saving
      });
    }
  }

  /**
   * Deletes a user from the database.
   * 
   * @param userId - The ID of the user to delete.
   */
  deleteUser(userId: string) {
    if (userId) {
      remove(ref(this.db, `users/${userId}`)).then(() => {
        this.fetchUsers(); // Refresh the user list after deletion
      });
    }
  }
}
