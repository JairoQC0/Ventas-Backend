import prisma from "../../config/prisma.js";
import { z } from "zod";

/* =============================
   VALIDACIÓN
============================= */

const ProductSchema = z.object({
  sku: z.string(),
  nombre: z.string(),
  precioVenta: z.number(),
  costo: z.number(),
  categoriaId: z.number().optional(),
  descripcion: z.string().optional(),
  codigoBarra: z.string().optional(),
  unidadMedida: z.string().optional(),
  imagenUrl: z.string().optional(),
});

/* =============================
   LISTAR PRODUCTOS
============================= */
export async function listProductsController(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { nombre: "asc" },
    });

    return res.json(products);
  } catch (err) {
    next(err);
  }
}

/* =============================
   CREAR PRODUCTO
============================= */
export async function createProductController(req, res, next) {
  try {
    const data = ProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data,
    });

    return res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/* =============================
   EDITAR PRODUCTO
============================= */
export async function updateProductController(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = ProductSchema.partial().parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return res.json(product);
  } catch (err) {
    next(err);
  }
}

/* =============================
   ELIMINAR PRODUCTO
============================= */
export async function deleteProductController(req, res, next) {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    return res.json({ ok: true, message: "Producto eliminado" });
  } catch (err) {
    next(err);
  }
}
