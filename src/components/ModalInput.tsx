import { Dispatch, FormEvent, SetStateAction } from 'react';

interface Props {
  handleSubmit: (e: FormEvent) => Promise<void>;
  modalType: 'TAMBAH' | 'EDIT';
  setKodeFrm: Dispatch<SetStateAction<string>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setJudulFrm: Dispatch<SetStateAction<string>>;
  setKategoriFrm: Dispatch<SetStateAction<string>>;
  setCoverFrm: Dispatch<SetStateAction<string | Blob>>;
  setTahunFrm: Dispatch<SetStateAction<string>>;
  tahunFrm: string;
  setPenerbitFrm: Dispatch<SetStateAction<string>>;
}

export default function ModalInput({
  handleSubmit,
  setKodeFrm,
  modalType,
  setShowModal,
  setJudulFrm,
  setKategoriFrm,
  setCoverFrm,
  setTahunFrm,
  tahunFrm,
  setPenerbitFrm,
}: Props) {
  return (
    <>
      <div
        className="absolute right-0 left-0 bottom-0 top-0 h-[100vh] bg-[rgba(0,0,0,0.4)]"
        onClick={() => setShowModal(false)}
      ></div>
      <div className="absolute top-0 left-0 right-0 z-10 mx-auto w-[700px] py-12">
        <div role="alert" className="container mx-auto w-11/12 max-w-full">
          <form onSubmit={handleSubmit}>
            <div className="relative rounded-lg border border-gray-400 bg-white py-8 px-5 shadow-md md:px-10">
              <div className="mb-3 flex w-full justify-start text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-wallet"
                  width={52}
                  height={52}
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                  <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                </svg>
              </div>
              <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-gray-800">
                {modalType == 'TAMBAH' && 'Tambah Data Buku'}
                {modalType == 'EDIT' && 'Edit Data Buku'}
              </h1>
              <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Judul
              </label>
              <input
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                placeholder="The book"
                onChange={e => setJudulFrm(e.target.value)}
              />
              <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Kategori
              </label>
              <input
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                placeholder="Novel"
                onChange={e => setKategoriFrm(e.target.value)}
              />
              <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Tahun
              </label>
              <input
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                placeholder="0000"
                onChange={e => {
                  const val = e.target.value;
                  if (val == '') {
                    setTahunFrm(val);
                  }
                  if (/^[0-9]+$/.test(val) && val.length <= 4) {
                    setTahunFrm(val);
                  }
                }}
                value={tahunFrm}
              />
              <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Penerbit
              </label>
              <input
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                placeholder="media"
                onChange={e => setPenerbitFrm(e.target.value)}
              />
              <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Kode
              </label>
              <input
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                placeholder="KO/0/1"
                onChange={e => setKodeFrm(e.target.value)}
              />
              <label htmlFor="name" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Cover
              </label>
              <input
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-pink-700 focus:outline-none"
                type="file"
                onChange={e => {
                  if (!e.target.files) return;
                  setCoverFrm(e.target.files[0]);
                }}
              />
              <div className="flex w-full items-center justify-start">
                <button
                  className="rounded bg-primary px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
                  type="submit"
                >
                  Simpan
                </button>
                <button
                  className="ml-3 rounded border  bg-gray-100 px-8 py-2 text-sm text-gray-600 transition duration-150 ease-in-out hover:border-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
