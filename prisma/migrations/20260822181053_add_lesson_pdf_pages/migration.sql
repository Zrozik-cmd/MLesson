-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "pdfPages" TEXT[] DEFAULT ARRAY[]::TEXT[];
