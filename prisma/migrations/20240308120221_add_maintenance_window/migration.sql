-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "maintenanceWindowEndTime" TIMESTAMP(3),
ADD COLUMN     "maintenanceWindowStartTime" TIMESTAMP(3);
