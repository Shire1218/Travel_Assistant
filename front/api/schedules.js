async function apiListSchedules(planId, date) {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    return request(`/schedules/plan/${planId}?${params}`);
}

async function apiAddSchedule(planId, data) {
    return request(`/schedules/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateSchedule(id, data) {
    return request(`/schedules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteSchedule(id) {
    return request(`/schedules/${id}`, {
        method: 'DELETE',
    });
}

async function apiCheckConflicts(planId, date) {
    return request(`/schedules/plan/${planId}/conflicts?date=${date}`);
}
