'use client';

const cookie = {
  setItem: (name: string, value: string, time?: number) => {
    document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=Lax;`;
  },

  /**
   *
   * @param {String} cookieName
   * @returns
   */
  getItem: (cookieName: string): string => {
    let name = cookieName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },

  /**
   *
   * @param {String} cookieName
   */
  deleteItem: (cookieName: string): void => {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970;path=/;SameSite=secure`;
  },
};

export { cookie as default };
