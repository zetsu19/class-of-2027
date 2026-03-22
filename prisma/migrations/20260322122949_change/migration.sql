/*
  Warnings:

  - You are about to drop the `classMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "classMembers";

-- CreateTable
CREATE TABLE "ClassMember" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("id")
);
