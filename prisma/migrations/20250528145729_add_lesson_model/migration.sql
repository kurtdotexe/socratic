/*
  Warnings:
  - You are about to drop the column `description` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the `UserProgress` table. If the table is not empty, all the data it contains will be lost.
*/
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_lessonId_fkey";
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_userId_fkey";
ALTER TABLE "Curriculum" ADD COLUMN     "completedLessonsCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "startDate" DROP DEFAULT;
ALTER TABLE "Lesson" DROP COLUMN "description",
DROP COLUMN "order",
DROP COLUMN "title",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "concepts" TEXT[],
ADD COLUMN     "conversationHistory" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "day" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
DROP TABLE "UserProgress";
