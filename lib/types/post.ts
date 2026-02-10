export interface Post {
  _id: string;
  id?: string;
  title: string;
  content: string;
  providerId: string;
  providerName?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  isPublic?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
}
