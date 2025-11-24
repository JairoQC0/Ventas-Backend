/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Store_nombre_key" ON "Store"("nombre");
