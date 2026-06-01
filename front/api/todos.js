async function apiListTodos(planId) {
    return request(`/todos/plan/${planId}`);
}

async function apiAddTodo(planId, data) {
    return request(`/todos/plan/${planId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function apiToggleTodo(id) {
    return request(`/todos/${id}/toggle`, {
        method: 'PUT',
    });
}

async function apiUpdateTodo(id, data) {
    return request(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function apiDeleteTodo(id) {
    return request(`/todos/${id}`, {
        method: 'DELETE',
    });
}
