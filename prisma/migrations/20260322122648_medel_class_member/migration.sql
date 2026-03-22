-- CreateTable
CREATE TABLE "classMembers" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classMembers_pkey" PRIMARY KEY ("id")
);
