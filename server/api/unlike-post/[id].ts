import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id');

  const deleted = await prisma.likes.delete({
    where: { id: Number(postId) },
  });

  return deleted;
});
