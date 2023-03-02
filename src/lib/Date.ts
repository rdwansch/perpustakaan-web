const month = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const getFullDate = (date: Date) => `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`;
