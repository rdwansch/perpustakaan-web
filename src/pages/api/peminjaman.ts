import { prisma } from '@/prisma/config';
import { NextApiRequest, NextApiResponse } from 'next';

interface Peminjaman {
  buku: {
    judul: string;
  };
  user: {
    nama: string;
    username: string;
  };
  durasi: number;
  tanggal_pinjam: Date;
  status: string;
  jumlah_buku: number;
  id: number;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'GET') {
    try {
      const peminjaman = await prisma.peminjaman.findMany({
        select: {
          jumlah_buku: true,
          durasi: true,
          status: true,
          tanggal_pinjam: true,
          id: true,
          buku: {
            select: { judul: true },
          },
          user: {
            select: { nama: true, username: true },
          },
        },
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

      return res.status(200).json({ message: 'Data Peminjaman', data: peminjaman });
    } catch (err) {
      console.log(err);
      return res.status(500).end('Internal Server Error');
    }
  }

  if (req.method === 'POST') {
    console.log('HARUS USER');
  }

  if (req.method === 'PUT') {
    const data: Peminjaman = JSON.parse(req.body);

    try {
      const peminjaman = await prisma.peminjaman.update({
        data: {
          status: data.status,
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
      const peminjaman = await prisma.peminjaman.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Sukses mehapus Buku', data: [] });
    } catch (err) {
      console.log(err);
      res.status(500).end('Internal Server Error');
    }
  }
}
