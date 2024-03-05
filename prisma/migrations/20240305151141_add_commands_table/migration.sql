-- CreateTable
CREATE TABLE "Command" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(6),
    "type" VARCHAR(255) NOT NULL,
    "data" JSONB,
    "status" VARCHAR(255) NOT NULL,
    "triggeredBy" VARCHAR(255),
    "deploymentId" TEXT NOT NULL,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
