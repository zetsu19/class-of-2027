-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "ClassMember" ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "role" "Role";
