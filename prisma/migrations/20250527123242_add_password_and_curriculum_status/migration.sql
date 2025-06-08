/*
  Warnings:
  - The `status` column on the `Curriculum` table would be dropped and recreated. This will lead to data loss if there is data in the column.
*/
CREATE TYPE "CurriculumStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');
ALTER TABLE "Curriculum" DROP COLUMN "status",
ADD COLUMN     "status" "CurriculumStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
