/*
  Warnings:
  - You are about to drop the column `completed` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `concepts` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `conversationHistory` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `curriculumId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `lessons` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
*/
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_curriculumId_fkey";
ALTER TABLE "Curriculum" ADD COLUMN     "lessons" JSONB NOT NULL;
ALTER TABLE "Lesson" DROP COLUMN "completed",
DROP COLUMN "completedAt",
DROP COLUMN "concepts",
DROP COLUMN "conversationHistory",
DROP COLUMN "curriculumId",
DROP COLUMN "day",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "lastQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "conversationHistory" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON "Progress"("userId", "lessonId");
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
