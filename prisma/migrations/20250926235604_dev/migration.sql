/*
  Warnings:

  - You are about to drop the column `lastSent` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guildId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "joinChannelId" TEXT,
    "leaveChannelId" TEXT,
    "notifyChannelId" TEXT,
    "logChannelId" TEXT,
    "joinMessage" TEXT DEFAULT 'Welcome on {server}, {user}!',
    "leaveMessage" TEXT DEFAULT 'Goodbye {user}, we will miss you!',
    "enableJoinMessages" BOOLEAN NOT NULL DEFAULT true,
    "enableLeaveMessages" BOOLEAN NOT NULL DEFAULT false,
    "enableNotifications" BOOLEAN NOT NULL DEFAULT false,
    "enableLogs" BOOLEAN NOT NULL DEFAULT false,
    "enabledLogTypes" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Notification" ("channelId", "creator", "id", "type") SELECT "channelId", "creator", "id", "type" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Config_guildId_key" ON "Config"("guildId");
