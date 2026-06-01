async function apiListCheckins(planId, hasImage) {
    const params = new URLSearchParams();
    if (hasImage) params.set('image', 'true');
    return request(`/checkins/plan/${planId}?${params}`);
}

async function apiAddCheckin(planId, data) {
    return request(`/checkins/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateCheckin(id, data) {
    return request(`/checkins/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteCheckin(id) {
    return request(`/checkins/${id}`, {
        method: 'DELETE',
    });
}
