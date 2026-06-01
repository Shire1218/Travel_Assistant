async function apiListRouteSpots(planId) {
    return request(`/routes/plan/${planId}`);
}

async function apiAddRouteSpot(planId, data) {
    return request(`/routes/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateRouteSpot(id, data) {
    return request(`/routes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteRouteSpot(id) {
    return request(`/routes/${id}`, {
        method: 'DELETE',
    });
}

async function apiReorderRouteSpots(planId, order) {
    return request(`/routes/plan/${planId}/reorder`, {
        method: 'POST',
        body: JSON.stringify({ order }),
    });
}
