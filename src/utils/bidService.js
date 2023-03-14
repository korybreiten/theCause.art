import tokenService from './tokenService';

const BASE_URL = '/bids/';

export function create(formData) {
    return fetch(BASE_URL + 'create', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokenService.getToken()
            }),
        body: JSON.stringify(formData)
    })
    .then(res => {
        if (res.ok) return res.json();
        throw new Error('Create Bid Error!');
    })
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
        throw new Error('Bid Update Error!');
    })
}

export function getOne(formData){
    return fetch(BASE_URL + 'one/' + formData.id, {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Bid Error!')
    })
}

export function getAll(){
    return fetch(BASE_URL + 'all', {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Bid Error!')
    })
}

export function getUser(formData){
    return fetch(BASE_URL + 'all/' + formData.id, {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Bid Error!')
    })
}

export function remove(formData){
    return fetch(BASE_URL + formData.id, {
        method: 'DELETE'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Delete Bid Error!')
    })
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
    create,
    update,
    getOne,
    getAll,
    getUser,
    remove
};