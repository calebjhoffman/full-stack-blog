import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function setUserMeta(userId, key, value) {
  return prisma.userMeta.upsert({
    where: { userId_key: { userId, key } },
    update: { value },
    create: { userId, key, value },
  });
}

export async function getUserMeta(userId) {
  try {
    if (!userId) {
      throw new Error('Missing userId in getUserMeta');
    }

    const rows = await prisma.userMeta.findMany({
      where: { userId },
    });

    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  } catch (err) {
    console.error('🔥 getUserMeta failed:', err);
    throw err;
  }
}

