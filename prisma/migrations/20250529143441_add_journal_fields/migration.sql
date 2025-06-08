/*
  Warnings:
  - You are about to drop the column `content` on the `JournalEntry` table. All the data in the column will be lost.
  - Added the required column `day` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reflection` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.
*/
ALTER TABLE "JournalEntry" DROP COLUMN "content",
ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "reflection" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;
