-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(255),
    "awsInstanceId" TEXT NOT NULL,
    "url" TEXT,
    "publicDns" TEXT,
    "vendorId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "validationUrl" TEXT,
    "userFriendlyUrl" TEXT,
    "deploymentKey" JSONB,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
