/*
  Warnings:
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
*/
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";
DROP TABLE "Progress";
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
