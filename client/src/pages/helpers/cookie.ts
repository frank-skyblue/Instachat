export const getUserCookie = function() {
  const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  return decodeURIComponent(cookie);
}