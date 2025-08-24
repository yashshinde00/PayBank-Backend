-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Customer', 'bankers');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'Customer',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Accounts" (
    "id" SERIAL NOT NULL,
    "deposits" DECIMAL(65,30) NOT NULL,
    "withdrawals" DECIMAL(65,30) NOT NULL,
    "UserId" INTEGER NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "public"."Users"("username");

-- AddForeignKey
ALTER TABLE "public"."Accounts" ADD CONSTRAINT "Accounts_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
