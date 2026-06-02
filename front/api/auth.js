async function apiRegister(nickname, phone) {
    const openid = 'wx_' + (phone || 'user_' + Date.now());
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ openid, nickname, phone }),
    });
}

async function apiLogin(phone) {
    const openid = 'wx_' + (phone || 'user_' + Date.now());
    const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ openid }),
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
            console.log('Token已过期，重新登录');
            clearAuth();
        }
    }
    try {
        const openid = 'web_' + (localStorage.getItem('userId') || Date.now().toString());
        localStorage.setItem('userId', openid.replace('web_', ''));
        const res = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ openid }),
        });
        if (res.data) {
            setToken(res.data.token);
            setUser(res.data.user);
            return res.data;
        }
        throw new Error('登录失败：未返回数据');
    } catch (e) {
        console.error('自动登录失败:', e);
        throw e;
    }
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
