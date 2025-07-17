-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "type" TEXT,
ALTER COLUMN "mimetype" DROP NOT NULL;
