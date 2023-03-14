import tokenService from './tokenService';

const BASE_URL = '/users/';

export function join(creds) {
  return fetch(BASE_URL + 'join', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(creds)
  })
  .then(res => {
    if (res.ok) {
      console.log('Sign Up Success!')
      return res.json();
    } else {
      throw new Error('Sign Up Error!');
    };
  })
  .then(({token}) => tokenService.setToken(token));
}

export function login(creds) {
  return fetch(BASE_URL + 'login', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(creds)
  })
  .then((res) => {
    if (res.ok) {
      console.log('Log In Success!')
      return res.json();
    } else {
      throw new Error('Invalid Credentials!');
    };
  })
  .then(({token}) => tokenService.setToken(token));
}

export function logout() {
  tokenService.removeToken();
}

export function getToken() {
  return tokenService.getUserFromToken();
}

export function update(formData) {
  return fetch(BASE_URL + formData.id, {
      method: 'PUT',
      headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tokenService.getToken()
          }),
      body: JSON.stringify(formData)
  })
  .then(res => {
      if (res.ok) return res.json();
      throw new Error('Profile Update Error!');
  })
}

export function getOne(formData) {
  return fetch(BASE_URL + 'one/' + formData.id, {
      method: 'GET'
  })
  .then(res => {
      if (res.ok) return res.json();
      throw new Error('Get User Error!');
  })
}

export function getUsername(formData) {
  return fetch(BASE_URL + 'username/' + formData.username, {
      method: 'GET'
  })
  .then(res => {
      if (res.ok) return res.json();
      throw new Error('Get User Error!');
  })
}

export function getAll() {
  return fetch(BASE_URL + 'all', {
      method: 'GET'
  })
  .then(res => {
      if (res.ok) return res.json();
      throw new Error('Get User Error!');
  })
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  join,
  login, 
  getToken,
  update,
  getOne,
  getUsername,
  getAll,
  logout
};