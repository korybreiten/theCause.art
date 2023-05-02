import tokenService from './tokenService';

const BASE_URL = '/auctions/';

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
        throw new Error('Create Auction Error!');
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
        throw new Error('Auction Update Error!');
    })
}

export function getOne(formData){
    return fetch(BASE_URL + 'one/' + formData.id, {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Auction Error!')
    })
}

export function getAll(){
    return fetch(BASE_URL + 'all', {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Auctions Error!')
    })
}

export function getCause(formData){
    return fetch(BASE_URL + 'all/' + formData.id, {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Auctions Error!')
    })
}

export function remove(formData){
    return fetch(BASE_URL + formData.id, {
        method: 'DELETE'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Delete Auction Error!')
    })
}

export default {
    create,
    update,
    getOne,
    getAll,
    getCause,
    remove
};