ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";
DROP INDEX "Progress_lessonId_idx";
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
