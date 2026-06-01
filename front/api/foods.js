async function apiListFoods(planId, category) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    return request(`/foods/plan/${planId}?${params}`);
}

async function apiAddFood(planId, data) {
    return request(`/foods/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateFood(id, data) {
    return request(`/foods/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteFood(id) {
    return request(`/foods/${id}`, {
        method: 'DELETE',
    });
}
