import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

import { prisma } from '@/prisma/config';
import { UserValidate } from '@/prisma/validate';
import { ZodError } from 'zod';

// NextJS 13 by default true, so you can directly use body
// export const config = {
//   api: {
//      // if you're using other parser disable this
//     bodyParser: false,
//   },
// };

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // check if method not POST
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed!' });
  }

  if (req.method === 'POST') {
    // LOGIN
    if (req.headers.type === 'LOGIN') {
      // validate request
      if (!req.body.username && !req.body.password) {
        return res.status(401).json({ message: 'Username/ Password kosong!' });
      }

      try {
        // find database with username and password
        const user = await prisma.user.findFirstOrThrow({
          where: {
            username: req.body.username,
            password: req.body.password,
          },
          select: {
            username: true,
            password: true,
          },
        });

        // success Login
        res.status(200).json({ message: 'Berhasil Login', user });
      } catch (err) {
        // failed Login
        res.status(401).json({ message: 'Username/ Password salah!' });
      } finally {
        prisma.$disconnect();
      }
    }

    // REGISTER
    if (req.headers.type === 'REGISTER') {
      try {
        // find wiht username
        let username = await prisma.user.findFirst({
          where: { username: req.body.username },
          select: { username: true },
        });

        // if username exist
        if (username) {
          return res.status(409).json({ message: 'Username sudah terdaftar' });
        }

        // manually validate using then because
        // we wan't to catch error on validate and send to user

        // now validate req.body
        return (
          UserValidate.parseAsync(req.body)
            .then(
              // success validate
              validated =>
                // insert into DB
                prisma.user
                  .create({
                    data: {
                      ...validated,
                      password: bcrypt.hashSync(validated.password, 10),
                      uid: (Math.random() + 1).toString(30).substring(2),
                    },
                    select: {
                      nama: true,
                      username: true,
                      role: true,
                    },
                  })
                  // send success message
                  .then(user => res.status(200).json({ message: 'Sukses registrasi', data: user }))
            )
            // error validate
            .catch((err: ZodError) => res.status(400).json({ message: 'Gagal melakukan registrasi', error: err.issues }))
        );
      } catch (err) {
        // unpredicted error
        console.log(err);
        return res.status(500).end('Internal Server Error');
      } finally {
        prisma.$disconnect();
      }
    }
  }
}
