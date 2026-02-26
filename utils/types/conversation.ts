import { User } from "./auth";

export type MessageType = "text" | "image" | "file";

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  user1?: User;
  user2?: User;
  lastMessage?: Message;
  createdAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  sender?: User;
  message?: string | null;
  type: MessageType;
  object?: Record<string, any> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}
