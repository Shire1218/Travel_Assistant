async function apiListPlans(page = 1, limit = 20, status) {
    const params = new URLSearchParams({ page, limit });
    if (status) params.set('status', status);
    return request(`/plans?${params}`);
}

async function apiGetPlan(id) {
    return request(`/plans/${id}`);
}

async function apiCreatePlan(data) {
    return request('/plans', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdatePlan(id, data) {
    return request(`/plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeletePlan(id) {
    return request(`/plans/${id}`, {
        method: 'DELETE',
    });
}

async function apiGetStats() {
    return request('/plans/stats');
}
