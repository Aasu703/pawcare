export interface MessageAuthor {
  _id?: string;
  id?: string;
  Firstname?: string;
  Lastname?: string;
  email?: string;
  imageUrl?: string;
}

export interface Message {
  _id: string;
  id?: string;
  content: string;
  userId?: string | MessageAuthor;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMessageRequest {
  content: string;
}

export interface UpdateMessageRequest {
  content?: string;
}
