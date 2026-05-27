-- CreateTable
CREATE TABLE `WorldBoss` (
    `id` VARCHAR(191) NOT NULL,
    `bossId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `maxHp` BIGINT NOT NULL,
    `currentHp` BIGINT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `spawnedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `defeatedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorldBossParticipant` (
    `id` VARCHAR(191) NOT NULL,
    `worldBossId` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,
    `damage` BIGINT NOT NULL DEFAULT 0,
    `hits` INTEGER NOT NULL DEFAULT 0,
    `rewarded` BOOLEAN NOT NULL DEFAULT false,

    INDEX `WorldBossParticipant_worldBossId_idx`(`worldBossId`),
    UNIQUE INDEX `WorldBossParticipant_worldBossId_characterId_key`(`worldBossId`, `characterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorldBossParticipant` ADD CONSTRAINT `WorldBossParticipant_worldBossId_fkey` FOREIGN KEY (`worldBossId`) REFERENCES `WorldBoss`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
