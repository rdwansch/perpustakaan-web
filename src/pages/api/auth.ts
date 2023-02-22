import { prisma } from '@/prisma/config';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

// NextJS 13 by default true, so you can directly use body
// export const config = {
//   api: {
//      // if you're using other parser disable this
//     bodyParser: false,
//   },
// };

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed!' });
  }

  if (req.method === 'POST') {
    // if (!req.body.username && !req.body.password) {
    //   return res.status(401).json({ message: 'Username/ Password kosong!' });
    // }

    if (req.headers.type === 'LOGIN') {
      try {
        const user = await prisma.user.findFirstOrThrow({
          where: {
            username: req.body.username,
            password: req.body.password,
          },
        });

        const data = {
          username: user.username,
          role: user.role,
          nama: user.nama,
          uid: user.uid,
        };

        res.status(200).json({ message: 'Berhasil Login', data });
      } catch (err) {
        res.status(401).json({ message: 'Username/ Password salah!' });
      } finally {
        prisma.$disconnect();
      }
    } else {
      try {
        let user = await prisma.user.findFirst({
          where: {
            username: req.body.username,
          },
        });

        if (user) {
          return res.status(409).json({ message: 'Username sudah terdaftar' });
        }

        const password = await bcrypt.hash(req.body.password, 5);
        const uid = (Math.random() + 1).toString(30).substring(2);

        await prisma.user.create({
          data: {
            nama: req.body.nama,
            alamat: req.body.alamat,
            nomor_telepon: req.body.nomor_telepon,
            username: req.body.username,
            password,
            uid,
          },
        });
      } catch (err) {
        console.log(err);
      } finally {
        prisma.$disconnect();
      }

      res.status(200).json({ message: 'Test' });
    }
  }
}
