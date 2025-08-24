/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "tokenCreatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Users_accessToken_key" ON "public"."Users"("accessToken");
