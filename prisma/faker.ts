import { faker } from '@faker-js/faker/locale/id_ID';
import bcrypt from 'bcrypt';

export function createUser(n: number) {
  let users = [];
  users.push({
    username: 'ujklm23',
    nama: 'Ridhwan R. Siddiq',
    password: bcrypt.hashSync('rahasia', 10),
    uid: 'uff-0g',
    nomor_telepon: '+6281 2274 2892 1',
    alamat: 'Jl. Pegangsaan Timur No. 56',
    role: 'pustakawan',
  });

  for (let i = 0; i < n; i++) {
    const firstname = faker.name.firstName();
    const lastname = () => faker.name.lastName() + `${Math.floor(Math.random() * n)}`;
    users.push({
      username: faker.helpers.unique(lastname),
      nama: `${firstname} ${lastname()}`,
      password: bcrypt.hashSync('rahasia', 10),
      uid: (Math.random() + 1).toString(30).substring(2),
      nomor_telepon: faker.phone.number('+628# #### ####'),
      alamat: faker.address.streetAddress(true),
      role: faker.helpers.arrayElement(['member', 'pustakawan', 'admin']),
    });
  }

  return users;
}

export function createBuku(n: number) {
  let books = [];
  for (let i = 0; i < n; i++) {
    books.push({
      judul: `${faker.word.noun()} ${faker.word.verb()}`,
      tahun: faker.helpers.arrayElement([2017, 2018, 2020, 2021, 2023]),
      penerbit: faker.name.fullName(),
      kategori: faker.helpers.arrayElement(['Novel', 'Science', 'Psychology', 'Comic', 'History', 'Philosophy']),
      jumlah: Math.floor(Math.random() * 20),
      kode: `S8/${faker.helpers.arrayElement(['NV', 'SC', 'PS', 'CM', 'HTR', 'PH'])}/${i + 2}`,
    });
  }

  return books;
}
