import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';

export default async (cookies: RequestCookies) => {
  const token = cookies.get('token')?.value;

  if (token) {
    try {
      // Verify token

      const response = await fetch(`http://localhost:3000/api/auth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Type: 'VERIFY',
          Authorization: token,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return 'UNAUTHORIZE';
      }

      return data;
    } catch (err) {
      console.log('Error AuthHook', err);
      return 'UNAUTHORIZE';
    }
  } else {
    return 'UNAUTHORIZE';
  }
};
