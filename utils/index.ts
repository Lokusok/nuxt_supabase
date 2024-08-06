import type { ILike } from '~/types/like';

export function isLikeGuard(like: any): like is ILike {
  return Boolean(like.id) && Boolean(like.postId);
}
