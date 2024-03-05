/*
  Warnings:

  - You are about to drop the `Install` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Install" DROP CONSTRAINT "Install_serviceId_fkey";

-- DropTable
DROP TABLE "Install";
