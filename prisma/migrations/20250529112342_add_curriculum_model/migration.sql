/*
  Warnings:
  - You are about to drop the column `completedLessonsCount` on the `Curriculum` table. All the data in the column will be lost.
  - You are about to drop the column `concepts` on the `Curriculum` table. All the data in the column will be lost.
  - The `status` column on the `Curriculum` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `conversationHistory` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `lastQuestionIndex` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
*/
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";
ALTER TABLE "Curriculum" DROP CONSTRAINT "Curriculum_userId_fkey";
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_userId_fkey";
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_lessonId_fkey";
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";
DROP INDEX "Progress_userId_lessonId_key";
ALTER TABLE "Curriculum" DROP COLUMN "completedLessonsCount",
DROP COLUMN "concepts",
ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Progress" DROP COLUMN "conversationHistory",
DROP COLUMN "isCompleted",
DROP COLUMN "lastQuestionIndex",
DROP COLUMN "lessonId",
ADD COLUMN     "attempts" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "language" TEXT NOT NULL DEFAULT '{}',
ADD COLUMN     "math" TEXT NOT NULL DEFAULT '{}',
ADD COLUMN     "reading" TEXT NOT NULL DEFAULT '{}',
ADD COLUMN     "science" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
DROP TABLE "Account";
DROP TABLE "Lesson";
DROP TABLE "Session";
DROP TABLE "VerificationToken";
DROP TYPE "CurriculumStatus";
CREATE UNIQUE INDEX "Progress_userId_key" ON "Progress"("userId");
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
