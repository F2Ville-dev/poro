-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "lastSent" DATETIME
);
