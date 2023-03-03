import { prisma } from '@/prisma/config';
import { pengembalian } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'GET') {
    try {
      const pengembalian = await prisma.pengembalian.findMany({
        select: {
          status: true,
          tanggal_pinjam: true,
          id: true,
          denda: true,
          tanggal_kembali: true,
          buku: {
            select: { judul: true, cover: true, kode: true },
          },
          user: {
            select: { nama: true, username: true },
          },
        },
        orderBy: { id: 'desc' },
        where: {
          user: {
            username: {
              contains: req.query.username ? `${req.query.username}` : '',
            },
            role: {
              not: 'pustakawan',
            },
          },
        },
      });

      return res.status(200).json({ message: 'Data Peminjaman', data: pengembalian });
    } catch (err) {
      console.log(err);
      return res.status(500).end('Internal Server Error');
    }
  }

  if (req.method === 'POST') {
    const data = JSON.parse(req.body);

    try {
      const pengembalian = await prisma.pengembalian.create({
        data: {
          denda: 0,
          tanggal_pinjam: `${data.tanggal_pinjam}`,
          status: 'Menunggu Konfirmasi',
          user: { connect: { username: data.username } },
          buku: { connect: { kode: data.kode } },
        },
      });

      res.status(200).json({ message: 'Berhasil meminjam Buku' });
    } catch (err) {
      console.log(err);
      return res.status(500).end('Internal Server Error');
    }
  }

  if (req.method === 'PUT') {
    const data: pengembalian = JSON.parse(req.body);

    try {
      const pengembalian = await prisma.pengembalian.update({
        data: {
          status: data.status,
          denda: parseInt(data.denda + '' ?? 0),
        },
        where: {
          id: data.id,
        },
      });

      res.status(200).json({ message: 'Status di-edit', data: [] });
    } catch (err) {
      console.log(err);
      res.status(500).end('Internal Server Error');
    }
  }

  if (req.method === 'DELETE') {
    const { id } = JSON.parse(req.body);

    try {
      const pengembalian = await prisma.pengembalian.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Sukses mehapus Buku', data: [] });
    } catch (err) {
      console.log(err);
      res.status(500).end('Internal Server Error');
    }
  }
}
