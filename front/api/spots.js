async function apiListSpotDetails(planId) {
    return request(`/spots/plan/${planId}`);
}

async function apiAddSpotDetail(planId, data) {
    return request(`/spots/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateSpotDetail(id, data) {
    return request(`/spots/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteSpotDetail(id) {
    return request(`/spots/${id}`, {
        method: 'DELETE',
    });
}
