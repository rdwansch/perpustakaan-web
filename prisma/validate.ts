import { z } from 'zod';

export const UserValidate = z.object({
  nama: z.string({
    invalid_type_error: 'Name must be string!',
    required_error: 'Nama harus diisi!',
  }),
  username: z.string({
    invalid_type_error: 'Username must be string!',
    required_error: 'username harus diisi!',
  }),
  password: z.string({
    invalid_type_error: 'Password must be string!',
    required_error: 'Password harus diisi!',
  }),
  alamat: z.string({
    invalid_type_error: 'Alamat must be string!',
    required_error: 'Alamat harus diisi!',
  }),
  nomor_telepon: z.string({
    invalid_type_error: 'nomor_telepon must be string!',
    required_error: 'Nomor Telepon harus diisi!',
  }),
});

export const BukuValidate = z.object({
  judul: z.string({
    invalid_type_error: 'Judul must be string!',
    required_error: 'Judul harus diisi!',
  }),
  cover: z
    .string({
      invalid_type_error: 'Cover must be string!',
    })
    .optional(),
  sinopsis: z
    .string({
      invalid_type_error: 'Cover must be string!',
    })
    .optional(),
  tahun: z.number({
    invalid_type_error: 'Tahun must be number!',
    required_error: 'Tahun harus diisi!',
  }),
  penerbit: z.string({
    invalid_type_error: 'Penerbit must be string!',
    required_error: 'Penerbit harus diisi!',
  }),
  kategori: z.string({
    invalid_type_error: 'Kategori must be string!',
    required_error: 'Kategori harus diisi!',
  }),
  jumlah: z.number({
    invalid_type_error: 'Jumlah must be number!',
    required_error: 'Jumlah harus diisi!',
  }),
  kode: z.string({
    invalid_type_error: 'Kode must be string!',
    required_error: 'Kode harus diisi!',
  }),
});
