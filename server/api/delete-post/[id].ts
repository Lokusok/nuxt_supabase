import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id');

  const deletedPost = await prisma.posts.delete({
    where: { id: Number(postId) },
  });

  return deletedPost;
});
