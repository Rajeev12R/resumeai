export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const rawValue = parts.pop().split(';').shift();
    try {
      // Decode URI component since express res.cookie URL-encodes JSON
      return JSON.parse(decodeURIComponent(rawValue));
    } catch (e) {
      return decodeURIComponent(rawValue);
    }
  }
  return null;
};
