import tokenService from './tokenService';

const BASE_URL = '/images/';

export function saveImage(formData) {
    return fetch(BASE_URL + 'save_image', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + tokenService.getToken()
            }),
        body: formData
    })
    .then(res => {
        if (res.ok) return res.json();
        throw new Error('Save Image Error!');
    })
}

export default {
    saveImage
};