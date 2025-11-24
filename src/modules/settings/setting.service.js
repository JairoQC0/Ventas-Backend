import prisma from "../../config/prisma.js";

export async function getAllSettings() {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((s) => [s.clave, s.valor]));
}

export async function updateSettings(data) {
  const ops = Object.entries(data).map(([clave, valor]) =>
    prisma.setting.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor },
    })
  );

  await prisma.$transaction(ops);

  return getAllSettings();
}
