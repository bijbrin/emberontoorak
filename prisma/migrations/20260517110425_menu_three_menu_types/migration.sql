-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('A_LA_CARTE', 'LUNCH', 'DRINKS');

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "priceNote" TEXT,
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MenuSection" ADD COLUMN     "menuType" "MenuType" NOT NULL DEFAULT 'A_LA_CARTE',
ADD COLUMN     "parentSlug" TEXT;
