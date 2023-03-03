import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/config';
import formidable from 'formidable';
import IncomingForm from 'formidable/Formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ParsedData {
  judul: string;
  jumlah: number;
  cover: string | null;
  tahun: number;
  penerbit: string;
  kategori: string;
  kode: string;
  sinopsis: string;
}

function toFindDuplicates(arry: Array<string | undefined>) {
  return arry.filter((item, index) => arry.indexOf(item) !== index);
}

function parseRaw(files: any, fields: any) {
  let newPath: string | null = null;
  let rawData: Buffer | string = '';

  if (!(JSON.stringify(files) == '{}')) {
    const mimetype: string = files.cover.mimetype.split('/')[1];

    rawData = fs.readFileSync(files.cover.filepath);
    const newFileName: string = files.cover.originalFilename.split('.')[0] + '_' + files.cover.newFilename;
    newPath = `./public/assets/${newFileName}.${mimetype}`;
  }

  const data: ParsedData = {
    judul: fields.judul + '',
    jumlah: parseInt(fields.jumlah + ''),
    cover: newPath && newPath.replace('./public', ''),
    tahun: parseInt(fields.tahun + ''),
    penerbit: fields.penerbit + '',
    kategori: fields.kategori + '',
    kode: fields.kode + '',
    sinopsis: fields.sinopsis + '',
  };

  return { data, newPath, rawData, oldPath: files?.cover?.filepath };
}

function clearAssets() {
  prisma.buku
    .findMany({ select: { cover: true }, where: { cover: { not: null } } })
    .then(buku => {
      // clear
      const assets = fs.readdirSync('./public/assets');
      const cover = buku.map(({ cover }) => cover?.replace('/assets/', ''));

      const usedAsset = toFindDuplicates([...assets, ...cover]);
      // usedAsset.map(uA => {
      //   if (asset == uA) {
      //     console.log('match');
      //     // console.log(path.join(__dirname, `/public/assets/${uA}`));
      //     // fs.unlink(path.join(__dirname, `/public/assets/${uA}`), err => err && console.log('ERR clear ->', err));
      //   }
      //   console.log('Not match');
      // });

      console.log(usedAsset);
      assets.map(asset => {});
    })
    .catch(err => err);
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

  if (req.method === 'POST') {
    const form: IncomingForm = formidable();

    const parsingData = async (err: any, fields: formidable.Fields, files: any) => {
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
          if (typeof rawData != 'string' && oldPath != undefined && newPath != null) {
            fs.writeFile(newPath, rawData, err => err && console.log('ERR writefile ->', err));
            fs.unlink(oldPath, err => err && console.log('ERR clear ->', err));
          }

          // clearAssets();

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

    const parsingData = async (err: any, fields: formidable.Fields, files: any) => {
      if (err) {
        console.log('ERR Parsing Data ->', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      const { data, newPath, oldPath, rawData } = parseRaw(files, fields);

      const cover = await prisma.buku
        .findFirst({
          select: { cover: true },
          where: { kode: data.kode },
        })
        .then(buku => buku?.cover);

      if (cover) {
        data.cover = cover;
      }

      // prisma.buku.findFirst({ where: { kode: data.kode }, select: { cover: true } }).then(buku => {
      //   console.log('BUKU', buku?.cover);
      //   fs.unlink(`./public${buku?.cover}`, err => err && console.log('ERR clear ->', err));
      // });

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
          if (typeof rawData != 'string' && oldPath != undefined && newPath != null) {
            fs.writeFile(newPath, rawData, err => err && console.log('ERR writefile ->', err));
            fs.unlink(oldPath, err => err && console.log('ERR clear ->', err));
          }

          clearAssets();

          return res.status(200).json({ message: 'Berhasil Edit Buku', data: buku });
        })
        .catch(err => {
          console.log(err);
          return res.status(409).json({ message: 'Kode Tidak/ Sudah ada' });
        });
    };

    form.parse(req, parsingData);
  }
}
