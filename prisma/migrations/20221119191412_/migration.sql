/*
  Warnings:

  - You are about to drop the `DiscordUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DiscordType" AS ENUM ('ROLE', 'USER');

-- DropForeignKey
ALTER TABLE "DiscordUser" DROP CONSTRAINT "DiscordUser_userId_fkey";

-- DropTable
DROP TABLE "DiscordUser";

-- CreateTable
CREATE TABLE "DiscordRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "snowflake" TEXT NOT NULL,
    "type" "DiscordType" NOT NULL DEFAULT 'ROLE',

    CONSTRAINT "DiscordRole_pkey" PRIMARY KEY ("id")
);
