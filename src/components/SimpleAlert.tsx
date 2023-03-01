import { Dispatch, SetStateAction } from 'react';

interface Props {
  heading: string;
  detail: string;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
  variant: 'SUCCESS' | 'DANGER';
}

export default function SimpleAlert({ heading, detail, setShowAlert, showAlert, variant }: Props) {
  return (
    <>
      {showAlert && (
        <div
          role="alert"
          className="absolute right-[64px] top-10 z-10 w-[500px] rounded-xl border border-gray-100 bg-white p-4 shadow-xl"
          onClick={() => setShowAlert(false)}
        >
          <div className="flex items-start gap-4">
            {variant == 'SUCCESS' && (
              <span className="text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            )}

            {variant == 'DANGER' && (
              <span className="text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </span>
            )}
            <div className="flex-1">
              <strong className="block font-medium text-gray-900">{heading}</strong>
              <p className="mt-1 text-sm text-gray-700">{detail}</p>
            </div>
            <button className="text-gray-500 transition hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
