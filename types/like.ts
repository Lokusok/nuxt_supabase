import type { IPost } from './post';

export interface ILike {
  id: number;
  userId: string;
  postId: number;
  createdAt: string;
  post: IPost | IPost['id'];
}
