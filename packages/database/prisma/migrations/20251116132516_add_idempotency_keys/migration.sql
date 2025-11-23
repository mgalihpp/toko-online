-- CreateTable
CREATE TABLE "IdempotencyKeys" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "order_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyKeys_key_key" ON "IdempotencyKeys"("key");
