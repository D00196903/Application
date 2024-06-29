/**
 * Interface representing a chat room.
 */
export interface Room {
  /**
   * Unique identifier for the chat room.
   */
  id: number;

  /**
   * List of usernames of users currently in the room.
   */
  users: string[];

  /**
   * Name of the room.
   */
  room: string;
}
