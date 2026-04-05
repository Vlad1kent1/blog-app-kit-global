import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Timestamp;
}
