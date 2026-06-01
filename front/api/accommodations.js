async function apiListAccommodations(planId) {
    return request(`/accommodations/plan/${planId}`);
}

async function apiAddAccommodation(planId, data) {
    return request(`/accommodations/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateAccommodation(id, data) {
    return request(`/accommodations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteAccommodation(id) {
    return request(`/accommodations/${id}`, {
        method: 'DELETE',
    });
}
