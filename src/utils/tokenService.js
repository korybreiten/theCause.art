export function setToken(token) {
    if (token) {
      // localStorage is given to us by the browser
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
  
export function getToken() {
  let token = localStorage.getItem('token');
  if (token) {
    // Check if expired, remove if it is
    // atob is a function that decodes a base-64 string
    const payload = JSON.parse(atob(token.split('.')[1]));
    // JWT's exp is expressed in seconds, not milliseconds, so convert
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      token = null;
    }
  }
  return token;
}
  
export function getUserFromToken() {
  const token = getToken();
  return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

export function removeToken() {
  localStorage.removeItem('token');
}
  
export default {
  setToken,
  getToken,
  removeToken,
  getUserFromToken
};