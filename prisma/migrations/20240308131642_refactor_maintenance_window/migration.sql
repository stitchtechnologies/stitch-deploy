-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "maintenanceWindowEndDay" TEXT,
ADD COLUMN     "maintenanceWindowStartDay" TEXT,
ALTER COLUMN "maintenanceWindowEndTime" SET DATA TYPE TEXT,
ALTER COLUMN "maintenanceWindowStartTime" SET DATA TYPE TEXT;
