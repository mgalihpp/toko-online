/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `Shipments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shipments_order_id_key" ON "Shipments"("order_id");
