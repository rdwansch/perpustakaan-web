import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

interface requestPost {
  nama: string;
  username: string;
  nomor_telepon: string;
  alamat: string;
  password: string;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // check if method not POST
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed!' });
  }

  if (req.method === 'POST') {
    // LOGIN
    if (req.headers.type === 'LOGIN') {
      const { username, password } = JSON.parse(req.body);

      // validate request
      if (!username && !password) {
        return res.status(401).json({ message: 'Username/ Password kosong!' });
      }

      try {
        // find database with username and password
        const user = await prisma.user.findFirstOrThrow({
          where: { username },
          select: {
            username: true,
            password: true,
            nama: true,
            role: true,
          },
        });

        const match = await bcrypt.compare(password, user.password);

        if (match) {
          // success Login

          // Generate JWT and send to client
          const token = jwt.sign(
            {
              username: user.username,
              nama: user.nama,
              role: user.role,
            },
            process.env.PRIVATE_KEY + '',
            { algorithm: 'HS256' }
          );

          return res.status(200).json({ message: 'Berhasil Login', data: { ...user, password: '***' }, token });
        }
      } catch (err) {
        // failed Login
        console.log(err);
        return res.status(401).json({ message: 'Username/ Password tidak sesuai!' });
      } finally {
        prisma.$disconnect();
      }
    }

    // REGISTER
    if (req.headers.type === 'REGISTER') {
      const requestPost: requestPost = JSON.parse(req.body);

      if (
        requestPost.username == '' ||
        requestPost.nama == '' ||
        requestPost.nomor_telepon == '' ||
        requestPost.alamat == '' ||
        requestPost.password == ''
      ) {
        return res.status(400).json({ message: 'Formulir tidak boleh kosong' });
      }

      try {
        // find wiht username
        let user = await prisma.user.findFirst({
          where: { username: requestPost.username },
          select: { username: true },
        });

        // if username exist
        if (user) {
          return res.status(409).json({ message: 'Username sudah terdaftar' });
        }

        // manually validate using "then" method because
        // we wan't to catch error on validate and send to user

        // now validate req.body
        return (
          UserValidate.parseAsync(requestPost)
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

    if (req.headers.type === 'VERIFY') {
      try {
        const JwtPayload = {
          nama: '',
          username: '',
          role: '',
          iat: 0,
        };
        // verify JWT
        const payload = jwt.verify(req.headers.authorization + '', process.env.PRIVATE_KEY + '') as typeof JwtPayload;

        return res.status(200).json({ message: 'Token valid', payload });
      } catch (err) {
        // console.log(err);
        return res.status(401).json({ message: 'Invalid Token' });
      }
    }

    return res.status(400).json({ message: 'Add type first' });
  }
}
