import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/config';
import { BukuValidate } from '@/prisma/validate';
import { ZodError } from 'zod';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // GET ALL BOOK
  if (req.method === 'GET') {
    try {
      // find all order by desc or where judul contains {}
      const books = await prisma.buku.findMany({
        orderBy: { id: 'desc' },
        select: {
          judul: true,
          cover: true,
          jumlah: true,
          kategori: true,
          kode: true,
          sinopsis: true,
          tahun: true,
        },
        where: {
          judul: {
            // query is "" or "{judul}"
            contains: req.query.judul ? `${req.query.judul}` : '',
          },
        },
      });

      if (books.length == 0) {
        return res.status(404).json({ message: 'Buku Tidak Ditemukan', data: books });
      }
      return res.status(200).json({ message: 'Data Buku', data: books });

      // send to response
    } catch (err) {
      // unpredicted error
      console.log(err);
      res.status(500).end('Internal Server Error');
    } finally {
      prisma.$disconnect();
    }
  }

  if (req.method === 'POST') {
    try {
      return BukuValidate.parseAsync(req.body)
        .then(validated =>
          prisma.buku
            .create({
              data: validated,
              select: {
                judul: true,
                penerbit: true,
                kode: true,
              },
            })
            .then(book => res.status(200).json({ message: 'Sukses menambahkan Buku!', data: book }))
            .catch(err => res.status(409).json({ message: 'Kode sudah ada' }))
        )
        .catch((err: ZodError) => res.status(400).json({ message: 'Gagal menambah Buku', err: err.issues }));
    } catch (err) {
      // unpredicted error
      console.log(err);
      res.status(500).end('Internal Server Error');
    }
  }

  if (req.method === 'PUT') {
    try {
      return BukuValidate.parseAsync(req.body)
        .then(validated =>
          prisma.buku
            .update({
              data: validated,
              select: {
                judul: true,
                penerbit: true,
                kode: true,
              },
              where: {
                id: req.body.id,
              },
            })
            .then(book => res.status(200).json({ message: 'Sukses mengedit Buku', data: book }))
            .catch(err => res.status(409).json({ message: 'Gagal mengedit buku', error: err }))
        )
        .catch((err: ZodError) => res.status(400).json({ message: 'Gagal mengedit Buku', error: err.issues }));
    } catch (err) {
      console.log(err);
      res.status(500).end('Internal Server Error');
    }
  }

  if (req.method === 'DELETE') {
    return prisma.buku
      .delete({
        where: {
          id: parseInt(req.body.id ?? 0),
        },
      })
      .then(() => res.status(200).json({ message: 'Sukses menghapus Buku' }))
      .catch(err => {
        console.log(err);
        return res.status(409).json({ message: 'Gagal menghapus Buku, id tidak tersedia' });
      });
  }
}
