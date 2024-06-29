/**
 * Interface representing a chat message.
 */
export interface Chat {
  /**
   * Unique identifier for the chat message.
   */
  id: string;

  /**
   * Username of the sender.
   */
  username: string;

  /**
   * First name of the sender (optional).
   */
  firstName?: string;

  /**
   * Content of the chat message.
   */
  message: string;

  /**
   * Timestamp indicating when the message was sent.
   */
  timestamp: string;

  /**
   * Name of the room where the message was sent.
   */
  roomName: string;
}
