-- CreateTable
CREATE TABLE "Install" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Install_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Install" ADD CONSTRAINT "Install_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
