/*
  Warnings:
  - You are about to drop the column `attempts` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `math` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `reading` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `science` on the `Progress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,lessonId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lessonId` to the `Progress` table without a default value. This is not possible if the table is not empty.
*/
DROP INDEX "Progress_userId_key";
ALTER TABLE "Progress" DROP COLUMN "attempts",
DROP COLUMN "language",
DROP COLUMN "math",
DROP COLUMN "reading",
DROP COLUMN "science",
ADD COLUMN     "conversationHistory" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastQuestionIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lessonId" TEXT NOT NULL;
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");
CREATE INDEX "Progress_lessonId_idx" ON "Progress"("lessonId");
CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON "Progress"("userId", "lessonId");
