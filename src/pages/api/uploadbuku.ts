import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/config';
import { BukuValidate } from '@/prisma/validate';
import { ZodError } from 'zod';
import formidable from 'formidable';
import IncomingForm from 'formidable/Formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseRaw(files: any, fields: any) {
  const mimetype: string = files.cover.mimetype.split('/')[1];
  const rawData: Buffer = fs.readFileSync(files.cover.filepath);
  const newFileName: string = files.cover.originalFilename.split('.')[0] + '_' + files.cover.newFilename;
  const newPath: string = `./public/assets/${newFileName}.${mimetype}`;

  const data = {
    judul: fields.judul + '',
    jumlah: parseInt(fields.jumlah + ''),
    cover: newPath.replace('./public', ''),
    tahun: parseInt(fields.tahun + ''),
    penerbit: fields.penerbit + '',
    kategori: fields.kategori + '',
    kode: fields.kode + '',
  };

  return { data, newPath, rawData, oldPath: files.cover.filepath };
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  fetch('http://localhost/api/auth', {
    method: 'POST',
    headers: {
      Authorization: req.headers.Authorization + '',
      Type: 'VERIFY',
    },
  }).then(response => {
    if (!response.ok) {
      return res
        .setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
        .writeHead(302, { location: '/auth/login' })
        .end();
    }
  });

  if (req.method === 'POST') {
    const form: IncomingForm = formidable();
    const parsingData = (err: any, fields: formidable.Fields, files: any) => {
      if (err) {
        console.log('ERR Parsing Data ->', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      const { data, newPath, oldPath, rawData } = parseRaw(files, fields);

      return prisma.buku
        .create({
          data,
          select: {
            judul: true,
            penerbit: true,
            kode: true,
          },
        })
        .then(buku => {
          fs.writeFile(newPath, rawData, err => err && console.log('ERR writefile ->', err));
          fs.unlink(oldPath, err => err && console.log('ERR clear ->', err));

          return res.status(200).json({ message: 'Berhasil menambah Buku', data: buku });
        })
        .catch(err => {
          console.log(err);
          return res.status(409).json({ message: 'Kode sudah ada' });
        });
    };

    return form.parse(req, parsingData);
  }

  if (req.method === 'PUT') {
    const form: IncomingForm = formidable();
    const parsingData = (err: any, fields: formidable.Fields, files: any) => {
      if (err) {
        console.log('ERR Parsing Data ->', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      const { data, newPath, oldPath, rawData } = parseRaw(files, fields);

      return prisma.buku
        .update({
          data,
          select: {
            judul: true,
            penerbit: true,
            kode: true,
          },
          where: {
            kode: data.kode,
          },
        })
        .then(buku => {
          fs.writeFile(newPath, rawData, err => err && console.log('ERR writefile ->', err));
          fs.unlink(oldPath, err => err && console.log('ERR clear ->', err));

          return res.status(200).json({ message: 'Berhasil Edit Buku', data: buku });
        })
        .catch(err => res.status(409).json({ message: 'Kode sudah ada' }));
    };

    form.parse(req, parsingData);

    // try {
    //   return BukuValidate.parseAsync(req.body)
    //     .then(validated =>
    //       prisma.buku
    //         .update({
    //           data: validated,
    //           select: {
    //             judul: true,
    //             penerbit: true,
    //             kode: true,
    //           },
    //           where: {
    //             id: req.body.id,
    //           },
    //         })
    //         .then(book => res.status(200).json({ message: 'Sukses mengedit Buku', data: book }))
    //         .catch(err => res.status(409).json({ message: 'Gagal mengedit buku', error: err }))
    //     )
    //     .catch((err: ZodError) => res.status(400).json({ message: 'Gagal mengedit Buku', error: err.issues }));
    // } catch (err) {
    //   console.log(err);
    //   res.status(500).end('Internal Server Error');
    // }
  }
}
