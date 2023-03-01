import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/config';
import { BukuValidate } from '@/prisma/validate';
import { ZodError } from 'zod';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

interface Books {
  kode: string;
  judul: string;
  cover: string | null;
  sinopsis: string | null;
  tahun: number;
  penerbit: string;
  kategori: string;
  jumlah: number;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // fetch('http://localhost:3000/api/auth', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: req.headers.Authorization + '',
  //     Type: 'VERIFY',
  //   },
  // }).then(response => {
  //   if (!response.ok) {
  //     return res
  //       .setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
  //       .writeHead(302, { location: '/auth/login' })
  //       .end();
  //   }
  // });

  // GET ALL BOOK
  if (req.method === 'GET') {
    try {
      let books: Array<Books> = [];
      if (req.query?.kode) {
        books = await prisma.buku.findMany({
          select: {
            judul: true,
            cover: true,
            jumlah: true,
            kategori: true,
            kode: true,
            sinopsis: true,
            penerbit: true,
            tahun: true,
          },
          where: {
            kode: {
              equals: req.query.kode ? `${req.query.kode}` : '',
            },
          },
        });
      } else {
        // find all order by desc or where judul contains {}
        books = await prisma.buku.findMany({
          orderBy: { id: 'desc' },
          select: {
            judul: true,
            cover: true,
            jumlah: true,
            kategori: true,
            kode: true,
            sinopsis: true,
            penerbit: true,
            tahun: true,
          },
          where: {
            judul: {
              contains: req.query.judul ? `${req.query.judul}` : '',
            },
          },

          take: 18,
          skip: req.query.skip ? parseInt(`${req.query.skip}`) : 0,
        });
      }

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

  if (req.method === 'DELETE') {
    const { kode } = JSON.parse(req.body);
    return prisma.buku
      .delete({
        where: { kode },
        select: { judul: true },
      })
      .then(buku => res.status(200).json({ message: `Buku ${buku.judul} TERHAPUS` }))
      .catch(err => {
        console.log(err);
        return res.status(409).json({ message: 'Gagal menghapus Buku, kode tidak tersedia' });
      });
  }
}
