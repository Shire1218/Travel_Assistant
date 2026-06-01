async function apiListTransports(planId) {
    return request(`/transports/plan/${planId}`);
}

async function apiAddTransport(planId, data) {
    return request(`/transports/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateTransport(id, data) {
    return request(`/transports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteTransport(id) {
    return request(`/transports/${id}`, {
        method: 'DELETE',
    });
}
