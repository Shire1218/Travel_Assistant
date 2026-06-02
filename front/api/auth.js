async function apiRegister(username, password, nickname, phone, email) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, nickname, phone, email }),
    });
}

async function apiLogin(username, password) {
    const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    if (res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
    }
    return res;
}

async function apiAutoLogin() {
    let user = getUser();
    if (user && getToken()) {
        try {
            await apiGetMe();
            return { user, token: getToken() };
        } catch (e) {
            console.log('Token已过期，需要重新登录');
            clearAuth();
        }
    }
    throw new Error('未登录');
}

async function apiRefreshToken() {
    const token = getToken();
    if (!token) throw new Error('未登录');
    const res = await request('/auth/refresh', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
    });
    if (res.data && res.data.token) {
        setToken(res.data.token);
    }
    return res;
}
