/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offlineUUID]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "fromOffline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offlineUUID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Category_nombre_key" ON "Category"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_offlineUUID_key" ON "Sale"("offlineUUID");
