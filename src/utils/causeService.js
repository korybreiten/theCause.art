import tokenService from './tokenService';

const BASE_URL = '/causes/';

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
        throw new Error('Create Cause Error!');
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
        throw new Error('Cause Update Error!');
    })
}

export function getOne(formData){
    return fetch(BASE_URL + 'one/' + formData.id, {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Cause Error!')
    })
}

export function getAll(){
    return fetch(BASE_URL + 'all', {
        method: 'GET'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Get Causes Error!')
    })
}

export function remove(id){
    return fetch(BASE_URL + id, {
        method: 'DELETE'
    }).then(res => {
        if(res.ok) return res.json()
        throw new Error('Delete Cause Error!')
    })
}

export default {
    create,
    update,
    getOne,
    getAll,
    remove
};