-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VENDEDOR', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BOLETA', 'FACTURA', 'CONTROL_INTERNO');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('COMPLETADA', 'ANULADA', 'PENDIENTE_SUNAT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VENDEDOR',
    "storeId" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "ruc" TEXT,
    "contacto" TEXT,
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "costo" DECIMAL(10,2) NOT NULL,
    "codigoBarra" TEXT,
    "unidadMedida" TEXT,
    "imagenUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoriaId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "tiendaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "tipoDocumento" "DocumentType" NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "subTotal" DECIMAL(12,2) NOT NULL,
    "impuestos" DECIMAL(12,2) NOT NULL,
    "estado" "SaleStatus" NOT NULL DEFAULT 'COMPLETADA',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT NOT NULL,
    "referenciaPago" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleVoid" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleVoid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSunat" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "statusSunat" TEXT NOT NULL,
    "ticket" TEXT,
    "cdr" TEXT,
    "sentAt" TIMESTAMP(3),
    "response" TEXT,

    CONSTRAINT "InvoiceSunat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "accion" TEXT NOT NULL,
    "detalle" TEXT,
    "ip" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("clave")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_codigoBarra_key" ON "Product"("codigoBarra");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStock_productId_storeId_key" ON "ProductStock"("productId", "storeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStock" ADD CONSTRAINT "ProductStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStock" ADD CONSTRAINT "ProductStock_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_tiendaId_fkey" FOREIGN KEY ("tiendaId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleVoid" ADD CONSTRAINT "SaleVoid_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleVoid" ADD CONSTRAINT "SaleVoid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceSunat" ADD CONSTRAINT "InvoiceSunat_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
