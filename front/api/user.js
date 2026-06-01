async function apiGetMe() {
    return request('/users/me');
}

async function apiUpdateMe(data) {
    return request('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiUploadAvatar(avatarUrl) {
    return request('/users/avatar', {
        method: 'POST',
        body: JSON.stringify({ avatarUrl }),
    });
}
