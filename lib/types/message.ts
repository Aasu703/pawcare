export interface Message {
  _id: string;
  id?: string;
  content: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMessageRequest {
  content: string;
}

export interface UpdateMessageRequest {
  content?: string;
}
