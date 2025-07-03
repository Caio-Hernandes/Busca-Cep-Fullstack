/*
  Warnings:

  - A unique constraint covering the columns `[cep,userId]` on the table `ceps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ceps` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ceps_cep_key";

-- AlterTable
ALTER TABLE "ceps" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ceps_cep_userId_key" ON "ceps"("cep", "userId");

-- AddForeignKey
ALTER TABLE "ceps" ADD CONSTRAINT "ceps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
