import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Iniciando SEED...");

  // ADMIN
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@system.com" },
    update: {},
    create: {
      email: "admin@system.com",
      username: "admin",
      nombre: "Administrador",
      role: "ADMIN",
      passwordHash,
    },
  });

  // STORE
  const store = await prisma.store.upsert({
    where: { nombre: "Tienda Principal" },
    update: {},
    create: {
      nombre: "Tienda Principal",
      direccion: "Av. Principal 123",
      ruc: "12345678901",
    },
  });

  // CATEGORY
  const cat = await prisma.category.upsert({
    where: { nombre: "General" },
    update: {},
    create: { nombre: "General" },
  });

  // PRODUCTS
  const prod1 = await prisma.product.upsert({
    where: { sku: "P001" },
    update: {},
    create: {
      sku: "P001",
      nombre: "Producto Demo 1",
      precioVenta: 10.5,
      costo: 6,
      categoriaId: cat.id,
    },
  });

  const prod2 = await prisma.product.upsert({
    where: { sku: "P002" },
    update: {},
    create: {
      sku: "P002",
      nombre: "Producto Demo 2",
      precioVenta: 20,
      costo: 10,
      categoriaId: cat.id,
    },
  });

  // STOCK
  await prisma.productStock.createMany({
    data: [
      { productId: prod1.id, storeId: store.id, cantidad: 50 },
      { productId: prod2.id, storeId: store.id, cantidad: 80 },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 SEED COMPLETO");
}

main()
  .then(() => process.exit(0))
  .catch((e) => console.error(e));
