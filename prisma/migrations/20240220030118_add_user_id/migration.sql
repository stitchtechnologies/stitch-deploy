/*
  Warnings:

  - You are about to drop the column `usedId` on the `Vendor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "usedId",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '';
