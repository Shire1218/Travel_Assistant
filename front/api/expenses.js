async function apiListExpenses(planId) {
    return request(`/expenses/plan/${planId}`);
}

async function apiAddExpense(planId, data) {
    return request(`/expenses/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiUpdateExpense(id, data) {
    return request(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteExpense(id) {
    return request(`/expenses/${id}`, {
        method: 'DELETE',
    });
}
