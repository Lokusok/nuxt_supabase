import type { ILike } from './like';

export interface IPost {
  id: number;
  name: string;
  image: string;
  text: string;
  picture: string;
  title: string;
  userId: string;
  likes: ILike[];
}
