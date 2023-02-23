-- CreateTable
CREATE TABLE `buku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(100) NOT NULL,
    `cover` VARCHAR(255) NULL,
    `sinopsis` TEXT NULL,
    `tahun` INTEGER NOT NULL,
    `penerbit` VARCHAR(100) NOT NULL,
    `kategori` VARCHAR(100) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `kode` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `kode`(`kode`),
    UNIQUE INDEX `buku_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peminjaman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_buku` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `durasi` INTEGER NOT NULL,
    `tanggal_pinjam` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(255) NOT NULL,
    `jumlah_buku` INTEGER NOT NULL,

    INDEX `id_buku`(`id_buku`),
    INDEX `id_user`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengembalian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_buku` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `tanggal_kembali` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggal_pinjam` DATE NOT NULL,
    `denda` INTEGER NULL,
    `status` VARCHAR(255) NOT NULL,

    INDEX `id_buku`(`id_buku`),
    INDEX `id_user`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `username` VARCHAR(16) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `nomor_telepon` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL DEFAULT 'member',
    `uid` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_username_uid_key`(`username`, `uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_ibfk_1` FOREIGN KEY (`id_buku`) REFERENCES `buku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengembalian` ADD CONSTRAINT `pengembalian_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengembalian` ADD CONSTRAINT `pengembalian_ibfk_2` FOREIGN KEY (`id_buku`) REFERENCES `buku`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
