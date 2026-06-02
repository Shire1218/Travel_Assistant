const API_BASE_URL = window.APP_CONFIG?.API_BASE_URL || 'http://localhost:8080/v1';

function getToken() {
    return localStorage.getItem('token') || '';
}

function setToken(token) {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function setUser(user) {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
}

function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

async function request(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        const data = await response.json();

        if (data.code !== 0) {
            if (response.status === 401) {
                clearAuth();
                if (window.onAuthExpired) window.onAuthExpired();
            }
            throw new Error(data.message || '请求失败');
        }

        return data;
    } catch (err) {
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
            throw new Error('无法连接到后端服务，请确保后端已启动');
        }
        console.error('API请求错误:', err);
        throw err;
    }
}
