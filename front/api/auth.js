async function apiRegister(nickname, phone) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nickname, phone }),
    });
}

async function apiLogin(phone, password) {
    const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
    });
    if (res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
    }
    return res;
}

async function apiRefreshToken() {
    const token = getToken();
    if (!token) throw new Error('未登录');
    const res = await request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ token }),
    });
    if (res.data && res.data.token) {
        setToken(res.data.token);
    }
    return res;
}
