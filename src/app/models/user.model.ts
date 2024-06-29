/**
 * Interface representing a user.
 */
export interface User {
  status: string;
  online: boolean;
  username: string;
  /**
   * Unique identifier for the user (optional).
   */
  id?: string;

  /**
   * Email address of the user, can be null.
   */
  email: string | null;

  /**
   * Password of the user (optional).
   */
  password?: string;

  /**
   * First name of the user (optional).
   */
  firstName?: string;

  /**
   * Last name of the user (optional).
   */
  lastName?: string;

  /**
   * Display name of the user (optional).
   */
  displayName?: string;

  /**
   * Object representing friend requests received by the user. Keys are user IDs and values are boolean.
   */
  friendRequests?: { [key: string]: boolean };

  /**
   * Object representing friend requests sent by the user. Keys are user IDs and values are boolean.
   */
  friendRequestsSent?: { [key: string]: boolean };

  /**
   * Object representing friends of the user. Keys are user IDs and values are boolean.
   */
  friends?: { [key: string]: boolean };

  /**
   * Object representing users blocked by the user. Keys are user IDs and values are boolean.
   */
  blocked?: { [key: string]: boolean };

  /**
   * Object representing users who have blocked this user. Keys are user IDs and values are boolean.
   */
  blockedBy?: { [key: string]: boolean };
}
