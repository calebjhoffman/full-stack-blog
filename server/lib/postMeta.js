import { prisma } from '../prisma/client.js';

// 🔄 Upsert meta by postId + key
export async function upsertPostMeta(postId, key, value) {
  return await prisma.postMeta.upsert({
    where: { postId_key: { postId, key } },
    update: { value },
    create: { postId, key, value },
  });
}

// 📥 Get all meta as object: { key: value }
export async function getPostMetaMap(postId) {
  const metas = await prisma.postMeta.findMany({
    where: { postId },
  });

  return Object.fromEntries(metas.map(({ key, value }) => [key, value]));
}

// 🧾 Get raw list of meta rows
export async function getPostMetaRows(postId) {
  return await prisma.postMeta.findMany({
    where: { postId },
  });
}

// ❌ Optional: delete a specific meta key
export async function deletePostMeta(postId, key) {
  return await prisma.postMeta.delete({
    where: { postId_key: { postId, key } },
  });
}
