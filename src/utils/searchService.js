const BASE_URL = '/search/'

export function search(formData){
  return fetch(BASE_URL + formData.keyword, {
    method: 'GET'
  }).then(res => {
    if(res.ok) return res.json()
    throw new Error('Search Error!')
  })
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  search
};