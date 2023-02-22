import { z } from 'zod';
import errorMap from 'zod/lib/locales/en';

export const User = z.object({
  nama: z.string(),
  username: z.string(),
  password: z.string(),
  alamat: z.string(),
  nomor_telepon: z.string(),
});
