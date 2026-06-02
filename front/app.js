// ==================== 全局错误捕获 ====================
window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
    console.error('未处理的Promise拒绝:', event.reason);
    showToast('操作失败: ' + (event.reason?.message || '未知错误'));
});

window.addEventListener('error', function(event) {
    event.preventDefault();
    console.error('全局错误:', event.message);
    showToast('系统错误: ' + (event.message || '未知错误'));
    return true;
});

// ==================== 全局状态 ====================
let travelPlans = [];
let checkins = [];
let foods = [];
let routeSpots = [];
let scheduleItems = [];
let spotDetails = [];
let transports = [];
let accommodations = [];
let expenses = [];
let todos = [];

let currentPlanId = null;
let currentCheckinFilter = 'all';
let currentFoodFilter = 'all';
let currentEditorTab = 'route';
let currentSidebarTab = 'checkins';
let currentScheduleDate = '';
let autoSaveTimer = null;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', async function() {
    // 检查是否已登录
    const token = getToken();
    if (!token) {
        window.location.href = 'landing.html';
        return;
    }
    try {
        const authData = await apiAutoLogin();
        if (!authData || !authData.token) {
            console.error('自动登录失败');
            window.location.href = 'landing.html';
            return;
        }
        // 更新用户头像
        const user = getUser();
        if (user) {
            const avatar = document.getElementById('userAvatar');
            if (avatar) {
                const initial = (user.nickname || user.openid || 'U').charAt(0).toUpperCase();
                avatar.textContent = initial;
            }
        }
        await loadAllData();
    } catch (err) {
        console.error('初始化失败:', err);
        window.location.href = 'landing.html';
    }
    initResizer();
});

async function loadAllData() {
    try {
        const plansRes = await apiListPlans(1, 100);
        travelPlans = (plansRes.data && plansRes.data.items) || [];

        const statsRes = await apiGetStats();
        if (statsRes.data) {
            document.getElementById('totalPlans').textContent = statsRes.data.total || 0;
            document.getElementById('ongoingPlans').textContent = statsRes.data.ongoing || 0;
            document.getElementById('completedPlans').textContent = statsRes.data.completed || 0;
        }

        renderTravelPlans();

        if (travelPlans.length > 0) {
            currentPlanId = travelPlans[0].id;
            await loadPlanDetail(currentPlanId);
        }
    } catch (err) {
        console.error('加载数据失败:', err);
        showToast('加载数据失败');
    }
}

async function loadPlanDetail(planId) {
    try {
        const res = await apiGetPlan(planId);
        if (!res.data) {
            console.error('获取计划详情失败：未返回数据');
            showToast('获取计划详情失败');
            return;
        }
        const p = res.data;

        routeSpots = (p.routeSpots || []).map(s => ({ id: s.id, travelPlanId: planId, name: s.name, order: s.displayOrder || 0, distance: s.distanceKm || 0, duration: s.durationMin || 0 }));
        scheduleItems = (p.scheduleItems || []).map(s => ({ id: s.id, travelPlanId: planId, date: (s.date || '').split('T')[0], startTime: s.startTime || '', endTime: s.endTime || '', title: s.title || '', description: s.description || '', type: s.type || 'other' }));
        spotDetails = (p.spotDetails || []).map(s => ({ id: s.id, travelPlanId: planId, name: s.name || '', description: s.description || '', image: s.imageUrl || '', hours: s.openHours || '', ticket: s.ticketPrice || '', contact: s.contact || '' }));
        checkins = (p.checkins || []).map(c => ({ id: c.id, travelPlanId: planId, location: c.location || '', date: (c.date || '').split('T')[0], description: c.description || '', image: c.imageUrl || '' }));
        foods = (p.foods || []).map(f => ({ id: f.id, travelPlanId: planId, name: f.name || '', address: f.address || '', rating: f.rating || 3, category: f.category || 'local', price: f.pricePerPerson || 0, dishes: f.dishes || '', image: f.imageUrl || '', mapX: f.mapX || Math.random() * 70 + 10, mapY: f.mapY || Math.random() * 70 + 10 }));
        transports = (p.transports || []).map(t => ({ id: t.id, travelPlanId: planId, type: t.type || '其他', from: t.from || '', to: t.to || '', time: t.time || '', cost: t.cost || 0, note: t.note || '' }));
        accommodations = (p.accommodations || []).map(a => ({ id: a.id, travelPlanId: planId, name: a.name || '', address: a.address || '', checkIn: a.checkIn || '', checkOut: a.checkOut || '', price: a.price || 0, note: a.note || '' }));
        expenses = (p.expenses || []).map(e => ({ id: e.id, travelPlanId: planId, category: e.category || '其他', amount: e.amount || 0, date: e.date || '', note: e.note || '' }));
        todos = (p.todos || []).map(t => ({ id: t.id, travelPlanId: planId, text: t.text || '', completed: t.completed || false }));

        if (scheduleItems.length > 0) {
            currentScheduleDate = scheduleItems[0].date;
        } else if (p.startDate) {
            currentScheduleDate = p.startDate.split('T')[0];
        }

        renderAll();
    } catch (err) {
        console.error('加载计划详情失败:', err);
        showToast('加载计划详情失败: ' + err.message);
    }
}

// ==================== 主页面：旅行计划列表 ====================
function renderTravelPlans() {
    const container = document.getElementById('travelPlanList');
    const emptyState = document.getElementById('emptyState');
    if (travelPlans.length === 0) { container.innerHTML = ''; emptyState.classList.remove('hidden'); return; }
    emptyState.classList.add('hidden');

    const statusMap = { planned: { label: '计划中', class: 'status-planned', icon: 'fa-calendar' }, ongoing: { label: '进行中', class: 'status-ongoing', icon: 'fa-play' }, completed: { label: '已完成', class: 'status-completed', icon: 'fa-check' } };

    container.innerHTML = travelPlans.map((plan, index) => {
        const status = statusMap[plan.status] || statusMap.planned;
        const progress = plan.budget > 0 ? Math.min((plan.spent / plan.budget) * 100, 100) : 0;
        const days = Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24)) + 1;
        const checkinCount = checkins.filter(c => c.travelPlanId === plan.id).length;
        const foodCount = foods.filter(f => f.travelPlanId === plan.id).length;

        return `
            <div class="travel-card animate-fade-in-up" style="animation-delay: ${index * 0.1}s" onclick="navigateToDetail(${plan.id})">
                <div class="card-click-hint"><i class="fas fa-arrow-right mr-1"></i>进入编辑</div>
                <div class="card-image" style="background-image: url('${plan.imageUrl || plan.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}')">
                    <span class="location-text"><i class="fas fa-map-marker-alt mr-1"></i>${plan.destination}</span>
                </div>
                <div class="p-5">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${plan.title}</h3>
                            <p class="text-xs text-gray-500 mt-1"><i class="far fa-calendar-alt mr-1"></i>${plan.startDate.split('T')[0]} 至 ${plan.endDate.split('T')[0]} · ${days}天</p>
                        </div>
                        <span class="status-badge ${status.class}"><i class="fas ${status.icon} text-xs"></i>${status.label}</span>
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-4">${plan.description || ''}</p>
                    <div class="flex items-center gap-4 mb-4 text-xs text-gray-500">
                        <span><i class="fas fa-map-pin mr-1 text-primary"></i>${checkinCount} 条打卡</span>
                        <span><i class="fas fa-utensils mr-1 text-sunset"></i>${foodCount} 家美食</span>
                    </div>
                    <div class="mb-4">
                        <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5"><span>预算进度</span><span>¥${plan.spent} / ¥${plan.budget}</span></div>
                        <div class="progress-bar"><div class="progress" style="width: ${progress}%"></div></div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="event.stopPropagation(); editTravelPlan(${plan.id})" class="flex-1 py-2 text-sm font-medium text-primary bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"><i class="fas fa-edit mr-1"></i>编辑</button>
                        <button onclick="event.stopPropagation(); deleteTravelPlan(${plan.id})" class="py-2 px-3 text-sm text-coral bg-red-50 rounded-lg hover:bg-red-100 transition-colors"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    document.getElementById('totalPlans').textContent = travelPlans.length;
    document.getElementById('ongoingPlans').textContent = travelPlans.filter(p => p.status === 'ongoing').length;
    document.getElementById('completedPlans').textContent = travelPlans.filter(p => p.status === 'completed').length;
}

// ==================== 页面导航 ====================
function navigateToDetail(planId) {
    currentPlanId = planId;
    const plan = travelPlans.find(p => p.id === planId);
    if (!plan) {
        console.error('计划不存在:', planId);
        return;
    }

    const startDate = (plan.startDate || '').split('T')[0];
    const endDate = (plan.endDate || '').split('T')[0];
    document.getElementById('editorTitle').textContent = plan.title;
    document.getElementById('editorSubtitle').textContent = plan.destination + ' · ' + startDate + ' 至 ' + endDate;

    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('editorPage').classList.remove('hidden');

    loadPlanDetail(planId).catch(err => {
        console.error('加载计划详情失败:', err);
        showToast('加载失败: ' + err.message);
    });
    switchEditorTab('route');
    switchSidebarTab('checkins');
}

function goBack() {
    document.getElementById('editorPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    currentPlanId = null;
    loadAllData();
}

function renderAll() {
    renderRouteList();
    renderScheduleList();
    renderSpotsCards();
    renderTransportList();
    renderAccommodationList();
    renderBudgetSummary();
    renderExpenseList();
    renderTodoList();
    renderSidebarCheckins();
    renderSidebarFoods();
    renderSidebarMap();
    updateSidebarCounts();
    loadTravelNotes();
}

// ==================== 编辑区 Tab 切换 ====================
function switchEditorTab(tabName) {
    currentEditorTab = tabName;
    document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
    document.querySelectorAll('.editor-panel-content').forEach(panel => panel.classList.remove('active'));
    const panelMap = { route: 'tabRoute', spots: 'tabSpots', details: 'tabDetails' };
    const panel = document.getElementById(panelMap[tabName]);
    if (panel) panel.classList.add('active');
}

// ==================== 侧边栏 Tab 切换 ====================
function switchSidebarTab(tabName) {
    currentSidebarTab = tabName;
    document.querySelectorAll('.sidebar-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
    document.querySelectorAll('.sidebar-panel-content').forEach(panel => panel.classList.remove('active'));
    const panelMap = { checkins: 'sidebarCheckins', foods: 'sidebarFoods', map: 'sidebarMap' };
    const panel = document.getElementById(panelMap[tabName]);
    if (panel) panel.classList.add('active');
    if (tabName === 'map') renderSidebarMap();
}

// ==================== 路线规划 ====================
function renderRouteList() {
    const container = document.getElementById('routeList');
    const preview = document.getElementById('routePreview');
    const spots = routeSpots.filter(s => s.travelPlanId === currentPlanId).sort((a, b) => a.order - b.order);

    if (spots.length === 0) {
        container.innerHTML = '<div class="empty-state py-6"><i class="fas fa-route text-2xl"></i><p class="text-sm mt-2">暂无路线景点</p></div>';
        preview.innerHTML = '';
        return;
    }

    let html = '';
    spots.forEach((spot, index) => {
        html += `
            <div class="route-spot-item" draggable="true" data-id="${spot.id}" ondragstart="dragSpot(event, ${spot.id})" ondragover="event.preventDefault()" ondrop="dropSpot(event, ${spot.id})">
                <div class="route-spot-order">${spot.order}</div>
                <div class="route-spot-name">${spot.name}</div>
                <div class="route-spot-actions">
                    <button onclick="moveSpot(${spot.id}, -1)" title="上移"><i class="fas fa-arrow-up"></i></button>
                    <button onclick="moveSpot(${spot.id}, 1)" title="下移"><i class="fas fa-arrow-down"></i></button>
                    <button class="delete-btn" onclick="deleteSpot(${spot.id})" title="删除"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        if (index < spots.length - 1) html += '<div class="route-connector"></div>';
    });
    container.innerHTML = html;

    const totalDistance = spots.reduce((sum, s) => sum + (s.distance || 0), 0);
    const totalDuration = spots.reduce((sum, s) => sum + (s.duration || 0), 0);
    preview.innerHTML = `
        <h4><i class="fas fa-chart-line mr-2 text-primary"></i>路线概览</h4>
        <div class="route-stats">
            <div class="route-stat"><div class="stat-value">${spots.length}</div><div class="stat-label">景点数量</div></div>
            <div class="route-stat"><div class="stat-value">${totalDistance}km</div><div class="stat-label">总距离</div></div>
            <div class="route-stat"><div class="stat-value">${Math.round(totalDuration / 60 * 10) / 10}h</div><div class="stat-label">预计耗时</div></div>
        </div>
    `;
}

function addSpot() {
    const input = document.getElementById('spotSearchInput');
    const name = input.value.trim();
    if (!name) { showToast('请输入景点名称'); return; }
    const spotData = { name, distanceKm: 0, durationMin: 0 };
    apiAddRouteSpot(currentPlanId, spotData).then((res) => {
        if (res.data) {
            routeSpots.push({ id: res.data.id, travelPlanId: currentPlanId, name, order: res.data.displayOrder, distance: res.data.distanceKm, duration: res.data.durationMin });
        }
        input.value = '';
        renderRouteList();
        showToast('景点已添加');
    }).catch(err => showToast('添加失败: ' + err.message));
}

function deleteSpot(id) {
    if (!confirm('确定要删除这个景点吗？')) return;
    routeSpots = routeSpots.filter(s => s.id !== id);
    apiDeleteRouteSpot(id).then(() => {
        renderRouteList();
        showToast('景点已删除');
    }).catch(err => showToast('删除失败: ' + err.message));
}

function moveSpot(id, direction) {
    const spots = routeSpots.filter(s => s.travelPlanId === currentPlanId).sort((a, b) => a.order - b.order);
    const index = spots.findIndex(s => s.id === id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= spots.length) return;
    const tempOrder = spots[index].order;
    spots[index].order = spots[newIndex].order;
    spots[newIndex].order = tempOrder;
    const order = spots.map((s, i) => ({ id: s.id, order: i + 1 }));
    apiReorderRouteSpots(currentPlanId, order).then(() => {
        renderRouteList();
    }).catch(err => showToast('排序失败: ' + err.message));
}

let draggedSpotId = null;
function dragSpot(event, id) { draggedSpotId = id; event.target.classList.add('dragging'); }
function dropSpot(event, targetId) {
    event.preventDefault();
    if (!draggedSpotId || draggedSpotId === targetId) return;
    const spots = routeSpots.filter(s => s.travelPlanId === currentPlanId).sort((a, b) => a.order - b.order);
    const dragIndex = spots.findIndex(s => s.id === draggedSpotId);
    const dropIndex = spots.findIndex(s => s.id === targetId);
    const tempOrder = spots[dragIndex].order;
    spots[dragIndex].order = spots[dropIndex].order;
    spots[dropIndex].order = tempOrder;
    draggedSpotId = null;
    const order = spots.map((s, i) => ({ id: s.id, order: i + 1 }));
    apiReorderRouteSpots(currentPlanId, order).then(() => {
        renderRouteList();
    }).catch(err => showToast('排序失败: ' + err.message));
}

// ==================== 时间安排 ====================
function renderScheduleList() {
    const container = document.getElementById('scheduleList');
    const warning = document.getElementById('conflictWarning');
    let items = scheduleItems.filter(s => s.travelPlanId === currentPlanId && s.date === currentScheduleDate);
    items.sort((a, b) => a.startTime.localeCompare(b.startTime));

    let hasConflict = false;
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            if (items[i].startTime < items[j].endTime && items[i].endTime > items[j].startTime) hasConflict = true;
        }
    }
    warning.classList.toggle('hidden', !hasConflict);

    if (items.length === 0) {
        container.innerHTML = '<div class="empty-state py-6"><i class="fas fa-calendar text-2xl"></i><p class="text-sm mt-2">暂无安排</p></div>';
        return;
    }

    const typeColors = { transport: '#0EA5E9', sightseeing: '#6366F1', activity: '#10B981', food: '#F97316', other: '#94a3b8' };
    container.innerHTML = items.map(item => `
        <div class="schedule-item" style="border-left-color: ${typeColors[item.type] || '#0EA5E9'}">
            <div class="schedule-time">${item.startTime} - ${item.endTime}</div>
            <div class="schedule-info"><h4>${item.title}</h4><p>${item.description || ''}</p></div>
            <div class="schedule-actions">
                <button onclick="editScheduleItem(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteScheduleItem(${item.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');
}

function changeScheduleDate(delta) {
    const date = new Date(currentScheduleDate);
    date.setDate(date.getDate() + delta);
    currentScheduleDate = date.toISOString().split('T')[0];
    const d = new Date(currentScheduleDate);
    document.getElementById('scheduleDateLabel').textContent = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    renderScheduleList();
}

function addScheduleItem() {
    document.getElementById('scheduleEditId').value = '';
    document.getElementById('scheduleTitle').value = '';
    document.getElementById('scheduleDate').value = currentScheduleDate;
    document.getElementById('scheduleStartTime').value = '09:00';
    document.getElementById('scheduleEndTime').value = '11:00';
    document.getElementById('scheduleType').value = 'other';
    document.getElementById('scheduleDescription').value = '';
    openModal('schedule');
}

function editScheduleItem(id) {
    const item = scheduleItems.find(s => s.id === id);
    if (!item) return;
    document.getElementById('scheduleEditId').value = id;
    document.getElementById('scheduleTitle').value = item.title;
    document.getElementById('scheduleDate').value = item.date;
    document.getElementById('scheduleStartTime').value = item.startTime;
    document.getElementById('scheduleEndTime').value = item.endTime;
    document.getElementById('scheduleType').value = item.type || 'other';
    document.getElementById('scheduleDescription').value = item.description || '';
    openModal('schedule');
}

function saveSchedule(event) {
    event.preventDefault();
    try {
        const editId = document.getElementById('scheduleEditId').value;
        const scheduleData = {
            date: document.getElementById('scheduleDate').value,
            startTime: document.getElementById('scheduleStartTime').value,
            endTime: document.getElementById('scheduleEndTime').value,
            title: document.getElementById('scheduleTitle').value,
            description: document.getElementById('scheduleDescription').value,
            type: document.getElementById('scheduleType').value,
        };
        if (!scheduleData.date || !scheduleData.startTime || !scheduleData.endTime || !scheduleData.title) {
            showToast('请填写所有必填项');
            return;
        }
        if (editId) {
            apiUpdateSchedule(parseInt(editId), scheduleData).then(() => {
                const item = scheduleItems.find(s => s.id === parseInt(editId));
                if (item) Object.assign(item, scheduleData);
                closeModal('schedule');
                renderScheduleList();
                showToast('日程已更新');
            }).catch(err => {
                console.error('更新日程失败:', err);
                showToast('更新失败: ' + err.message);
            });
        } else {
            apiAddSchedule(currentPlanId, scheduleData).then((res) => {
                if (res.data) {
                    scheduleItems.push({
                        id: res.data.id,
                        travelPlanId: currentPlanId,
                        date: (res.data.date || scheduleData.date).split('T')[0],
                        startTime: res.data.startTime || scheduleData.startTime,
                        endTime: res.data.endTime || scheduleData.endTime,
                        title: res.data.title || scheduleData.title,
                        description: res.data.description || scheduleData.description,
                        type: res.data.type || scheduleData.type,
                    });
                }
                closeModal('schedule');
                renderScheduleList();
                showToast('活动已添加');
            }).catch(err => {
                console.error('添加日程失败:', err);
                showToast('添加失败: ' + err.message);
            });
        }
    } catch (err) {
        console.error('保存日程错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function deleteScheduleItem(id) {
    if (!confirm('确定要删除这个活动吗？')) return;
    scheduleItems = scheduleItems.filter(s => s.id !== id);
    apiDeleteSchedule(id).then(() => {
        renderScheduleList();
        showToast('活动已删除');
    }).catch(err => showToast('删除失败: ' + err.message));
}

// ==================== 景点介绍（卡片式） ====================
function renderSpotsCards() {
    const container = document.getElementById('spotsCardGrid');
    const spots = spotDetails.filter(s => s.travelPlanId === currentPlanId);

    if (spots.length === 0) {
        container.innerHTML = '<div class="empty-state py-8"><i class="fas fa-map-marker-alt text-2xl"></i><p class="text-sm mt-2">暂无景点介绍</p><p class="text-xs mt-1">点击"添加景点"开始编辑</p></div>';
        return;
    }

    container.innerHTML = spots.map(spot => `
        <div class="spot-card" onclick="openSpotEdit(${spot.id})">
            <div class="spot-card-image" style="background-image: url('${spot.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}')"></div>
            <div class="spot-card-body">
                <h4>${spot.name}</h4>
                <p>${spot.description || '暂无描述'}</p>
                <div class="spot-card-meta">
                    ${spot.hours ? `<span><i class="far fa-clock mr-1"></i>${spot.hours}</span>` : ''}
                    ${spot.ticket ? `<span><i class="fas fa-ticket-alt mr-1"></i>${spot.ticket}</span>` : ''}
                </div>
                <div class="spot-card-actions">
                    <button class="edit-btn" onclick="event.stopPropagation(); openSpotEdit(${spot.id})"><i class="fas fa-edit mr-1"></i>编辑</button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteSpotDetail(${spot.id})"><i class="fas fa-trash-alt mr-1"></i>删除</button>
                </div>
            </div>
        </div>
    `).join('');
}

function addSpotDetail() {
    document.getElementById('spotEditId').value = '';
    document.getElementById('spotEditName').value = '';
    document.getElementById('spotEditDescription').value = '';
    document.getElementById('spotEditImage').value = '';
    document.getElementById('spotEditHours').value = '';
    document.getElementById('spotEditTicket').value = '';
    document.getElementById('spotEditContact').value = '';
    openModal('spotEdit');
}

function openSpotEdit(id) {
    const spot = spotDetails.find(s => s.id === id);
    if (!spot) return;
    document.getElementById('spotEditId').value = id;
    document.getElementById('spotEditModalTitle').textContent = '编辑景点';
    document.getElementById('spotEditName').value = spot.name;
    document.getElementById('spotEditDescription').value = spot.description || '';
    document.getElementById('spotEditImage').value = spot.image || '';
    document.getElementById('spotEditHours').value = spot.hours || '';
    document.getElementById('spotEditTicket').value = spot.ticket || '';
    document.getElementById('spotEditContact').value = spot.contact || '';
    openModal('spotEdit');
}

function saveSpotDetail(event) {
    event.preventDefault();
    try {
        const editId = document.getElementById('spotEditId').value;
        const data = {
            name: document.getElementById('spotEditName').value,
            description: document.getElementById('spotEditDescription').value,
            imageUrl: document.getElementById('spotEditImage').value,
            openHours: document.getElementById('spotEditHours').value,
            ticketPrice: document.getElementById('spotEditTicket').value,
            contact: document.getElementById('spotEditContact').value
        };
        if (!data.name) { showToast('请输入景点名称'); return; }
        if (editId) {
            apiUpdateSpotDetail(parseInt(editId), data).then(() => {
                const spot = spotDetails.find(s => s.id === parseInt(editId));
                if (spot) Object.assign(spot, { name: data.name, description: data.description, image: data.imageUrl, hours: data.openHours, ticket: data.ticketPrice, contact: data.contact });
                closeModal('spotEdit');
                renderSpotsCards();
                showToast('景点信息已保存');
            }).catch(err => {
                console.error('更新景点失败:', err);
                showToast('保存失败: ' + err.message);
            });
        } else {
            apiAddSpotDetail(currentPlanId, data).then((res) => {
                if (res.data) {
                    spotDetails.push({ id: res.data.id, travelPlanId: currentPlanId, name: res.data.name || data.name, description: res.data.description || data.description, image: res.data.imageUrl || data.imageUrl, hours: res.data.openHours || data.openHours, ticket: res.data.ticketPrice || data.ticketPrice, contact: res.data.contact || data.contact });
                }
                closeModal('spotEdit');
                renderSpotsCards();
                showToast('景点信息已保存');
            }).catch(err => {
                console.error('添加景点失败:', err);
                showToast('保存失败: ' + err.message);
            });
        }
    } catch (err) {
        console.error('保存景点错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function deleteSpotDetail(id) {
    if (!confirm('确定要删除这个景点吗？')) return;
    spotDetails = spotDetails.filter(s => s.id !== id);
    apiDeleteSpotDetail(id).then(() => {
        renderSpotsCards();
        showToast('景点已删除');
    }).catch(err => showToast('删除失败: ' + err.message));
}

// ==================== 交通 ====================
function renderTransportList() {
    const container = document.getElementById('transportList');
    const items = transports.filter(t => t.travelPlanId === currentPlanId);
    if (items.length === 0) { container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">暂无交通记录</p>'; return; }
    const icons = { '高铁': 'fa-train', '飞机': 'fa-plane', '租车': 'fa-car', '公交': 'fa-bus', '其他': 'fa-road' };
    container.innerHTML = items.map(item => `
        <div class="detail-item">
            <div class="detail-item-icon" style="background: #dbeafe; color: #0EA5E9;"><i class="fas ${icons[item.type] || 'fa-road'}"></i></div>
            <div class="detail-item-info"><h4>${item.type}: ${item.from} → ${item.to}</h4><p>${item.time} · ¥${item.cost} · ${item.note || ''}</p></div>
            <div class="detail-item-actions"><button class="delete-btn" onclick="deleteTransport(${item.id})"><i class="fas fa-trash-alt"></i></button></div>
        </div>
    `).join('');
}

function addTransport() {
    document.getElementById('transportEditId').value = '';
    document.getElementById('transportType').value = '其他';
    document.getElementById('transportFrom').value = '';
    document.getElementById('transportTo').value = '';
    document.getElementById('transportTime').value = '';
    document.getElementById('transportCost').value = '0';
    document.getElementById('transportNote').value = '';
    openModal('transport');
}

function saveTransport(event) {
    event.preventDefault();
    try {
        const editId = document.getElementById('transportEditId').value;
        const data = {
            type: document.getElementById('transportType').value,
            from: document.getElementById('transportFrom').value,
            to: document.getElementById('transportTo').value,
            time: document.getElementById('transportTime').value,
            cost: parseFloat(document.getElementById('transportCost').value) || 0,
            note: document.getElementById('transportNote').value,
        };
        if (!data.from || !data.to) { showToast('请填写出发地和目的地'); return; }
        if (editId) {
            apiUpdateTransport(parseInt(editId), data).then(() => {
                const item = transports.find(t => t.id === parseInt(editId));
                if (item) Object.assign(item, data);
                closeModal('transport');
                renderTransportList();
                showToast('交通记录已更新');
            }).catch(err => showToast('更新失败: ' + err.message));
        } else {
            apiAddTransport(currentPlanId, data).then((res) => {
                if (res.data) {
                    transports.push({ id: res.data.id, travelPlanId: currentPlanId, type: res.data.type, from: res.data.from, to: res.data.to, time: res.data.time, cost: res.data.cost, note: res.data.note });
                }
                closeModal('transport');
                renderTransportList();
                showToast('交通记录已添加');
            }).catch(err => showToast('添加失败: ' + err.message));
        }
    } catch (err) {
        console.error('保存交通错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function deleteTransport(id) {
    transports = transports.filter(t => t.id !== id);
    apiDeleteTransport(id).then(() => {
        renderTransportList();
    }).catch(err => showToast('删除失败: ' + err.message));
}

// ==================== 住宿 ====================
function renderAccommodationList() {
    const container = document.getElementById('accommodationList');
    const items = accommodations.filter(a => a.travelPlanId === currentPlanId);
    if (items.length === 0) { container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">暂无住宿记录</p>'; return; }
    container.innerHTML = items.map(item => `
        <div class="detail-item">
            <div class="detail-item-icon" style="background: #e0e7ff; color: #6366F1;"><i class="fas fa-hotel"></i></div>
            <div class="detail-item-info"><h4>${item.name}</h4><p>${item.address} · ${item.checkIn} 至 ${item.checkOut} · ¥${item.price}/晚</p><p class="text-xs mt-1">${item.note || ''}</p></div>
            <div class="detail-item-actions"><button class="delete-btn" onclick="deleteAccommodation(${item.id})"><i class="fas fa-trash-alt"></i></button></div>
        </div>
    `).join('');
}

function addAccommodation() {
    document.getElementById('accommodationEditId').value = '';
    document.getElementById('accommodationName').value = '';
    document.getElementById('accommodationAddress').value = '';
    document.getElementById('accommodationCheckIn').value = '';
    document.getElementById('accommodationCheckOut').value = '';
    document.getElementById('accommodationPrice').value = '0';
    document.getElementById('accommodationNote').value = '';
    openModal('accommodation');
}

function saveAccommodation(event) {
    event.preventDefault();
    try {
        const editId = document.getElementById('accommodationEditId').value;
        const data = {
            name: document.getElementById('accommodationName').value,
            address: document.getElementById('accommodationAddress').value,
            checkIn: document.getElementById('accommodationCheckIn').value,
            checkOut: document.getElementById('accommodationCheckOut').value,
            price: parseFloat(document.getElementById('accommodationPrice').value) || 0,
            note: document.getElementById('accommodationNote').value,
        };
        if (!data.name || !data.address) { showToast('请填写名称和地址'); return; }
        if (editId) {
            apiUpdateAccommodation(parseInt(editId), data).then(() => {
                const item = accommodations.find(a => a.id === parseInt(editId));
                if (item) Object.assign(item, data);
                closeModal('accommodation');
                renderAccommodationList();
                showToast('住宿记录已更新');
            }).catch(err => showToast('更新失败: ' + err.message));
        } else {
            apiAddAccommodation(currentPlanId, data).then((res) => {
                if (res.data) {
                    accommodations.push({ id: res.data.id, travelPlanId: currentPlanId, name: res.data.name, address: res.data.address, checkIn: res.data.checkIn, checkOut: res.data.checkOut, price: res.data.price, note: res.data.note });
                }
                closeModal('accommodation');
                renderAccommodationList();
                showToast('住宿记录已添加');
            }).catch(err => showToast('添加失败: ' + err.message));
        }
    } catch (err) {
        console.error('保存住宿错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function deleteAccommodation(id) {
    accommodations = accommodations.filter(a => a.id !== id);
    apiDeleteAccommodation(id).then(() => {
        renderAccommodationList();
    }).catch(err => showToast('删除失败: ' + err.message));
}

// ==================== 预算管理 ====================
function renderBudgetSummary() {
    const plan = travelPlans.find(p => p.id === currentPlanId);
    const totalExpense = expenses.filter(e => e.travelPlanId === currentPlanId).reduce((sum, e) => sum + Number(e.amount), 0);
    const budget = plan ? Number(plan.budget) : 0;
    const remaining = budget - totalExpense;
    document.getElementById('budgetSummary').innerHTML = `
        <div class="budget-card total"><div class="budget-value">¥${budget.toLocaleString()}</div><div class="budget-label">总预算</div></div>
        <div class="budget-card spent"><div class="budget-value">¥${totalExpense.toLocaleString()}</div><div class="budget-label">已花费</div></div>
        <div class="budget-card remaining"><div class="budget-value">¥${remaining.toLocaleString()}</div><div class="budget-label">剩余</div></div>
    `;
}

function renderExpenseList() {
    const container = document.getElementById('expenseList');
    const items = expenses.filter(e => e.travelPlanId === currentPlanId);
    if (items.length === 0) { container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">暂无费用记录</p>'; return; }
    const catColors = { '交通': '#dbeafe', '住宿': '#e0e7ff', '餐饮': '#fef3c7', '门票': '#d1fae5', '其他': '#f1f5f9' };
    const catIcons = { '交通': 'fa-car', '住宿': 'fa-hotel', '餐饮': 'fa-utensils', '门票': 'fa-ticket-alt', '其他': 'fa-receipt' };
    container.innerHTML = items.map(item => `
        <div class="detail-item">
            <div class="detail-item-icon" style="background: ${catColors[item.category] || '#f1f5f9'}; color: #475569;"><i class="fas ${catIcons[item.category] || 'fa-receipt'}"></i></div>
            <div class="detail-item-info"><h4>${item.category} - ¥${item.amount}</h4><p>${item.date} · ${item.note || ''}</p></div>
            <div class="detail-item-actions"><button class="delete-btn" onclick="deleteExpense(${item.id})"><i class="fas fa-trash-alt"></i></button></div>
        </div>
    `).join('');
}

function addExpense() {
    document.getElementById('expenseEditId').value = '';
    document.getElementById('expenseCategory').value = '其他';
    document.getElementById('expenseAmount').value = '0';
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('expenseNote').value = '';
    openModal('expense');
}

function saveExpense(event) {
    event.preventDefault();
    try {
        const editId = document.getElementById('expenseEditId').value;
        const data = {
            category: document.getElementById('expenseCategory').value,
            amount: parseFloat(document.getElementById('expenseAmount').value) || 0,
            date: document.getElementById('expenseDate').value,
            note: document.getElementById('expenseNote').value,
        };
        if (!data.category || !data.amount) { showToast('请填写分类和金额'); return; }
        if (editId) {
            apiUpdateExpense(parseInt(editId), data).then(() => {
                const item = expenses.find(e => e.id === parseInt(editId));
                if (item) Object.assign(item, data);
                closeModal('expense');
                renderExpenseList();
                renderBudgetSummary();
                showToast('费用记录已更新');
            }).catch(err => showToast('更新失败: ' + err.message));
        } else {
            apiAddExpense(currentPlanId, data).then((res) => {
                if (res.data) {
                    expenses.push({ id: res.data.id, travelPlanId: currentPlanId, category: res.data.category, amount: res.data.amount, date: res.data.date, note: res.data.note });
                }
                closeModal('expense');
                renderExpenseList();
                renderBudgetSummary();
                showToast('费用记录已添加');
            }).catch(err => showToast('添加失败: ' + err.message));
        }
    } catch (err) {
        console.error('保存费用错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    apiDeleteExpense(id).then(() => {
        renderExpenseList();
        renderBudgetSummary();
    }).catch(err => showToast('删除失败: ' + err.message));
}

// ==================== 待办事项 ====================
function renderTodoList() {
    const container = document.getElementById('todoList');
    const items = todos.filter(t => t.travelPlanId === currentPlanId);
    if (items.length === 0) { container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">暂无待办事项</p>'; return; }
    container.innerHTML = items.map(item => `
        <div class="todo-item">
            <div class="todo-checkbox ${item.completed ? 'checked' : ''}" onclick="toggleTodo(${item.id})">${item.completed ? '<i class="fas fa-check text-xs"></i>' : ''}</div>
            <span class="todo-text ${item.completed ? 'completed' : ''}">${item.text}</span>
            <div class="detail-item-actions"><button class="delete-btn" onclick="deleteTodo(${item.id})"><i class="fas fa-trash-alt"></i></button></div>
        </div>
    `).join('');
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    apiToggleTodo(id).catch(err => showToast('操作失败: ' + err.message));
    renderTodoList();
}

function addTodo() {
    document.getElementById('todoEditId').value = '';
    document.getElementById('todoText').value = '';
    openModal('todo');
}

function saveTodo(event) {
    event.preventDefault();
    try {
        const editId = document.getElementById('todoEditId').value;
        const data = { text: document.getElementById('todoText').value };
        if (!data.text) { showToast('请填写待办内容'); return; }
        if (editId) {
            apiUpdateTodo(parseInt(editId), data).then(() => {
                const item = todos.find(t => t.id === parseInt(editId));
                if (item) item.text = data.text;
                closeModal('todo');
                renderTodoList();
                showToast('待办已更新');
            }).catch(err => showToast('更新失败: ' + err.message));
        } else {
            apiAddTodo(currentPlanId, data).then((res) => {
                if (res.data) {
                    todos.push({ id: res.data.id, travelPlanId: currentPlanId, text: res.data.text, completed: res.data.completed });
                }
                closeModal('todo');
                renderTodoList();
                showToast('待办事项已添加');
            }).catch(err => showToast('添加失败: ' + err.message));
        }
    } catch (err) {
        console.error('保存待办错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    apiDeleteTodo(id).then(() => {
        renderTodoList();
    }).catch(err => showToast('删除失败: ' + err.message));
}

function loadTravelNotes() {
    const plan = travelPlans.find(p => p.id === currentPlanId);
    document.getElementById('travelNotes').value = plan ? (plan.notes || '') : '';
}

// ==================== 侧边栏 - 打卡记录 ====================
function renderSidebarCheckins() {
    const container = document.getElementById('sidebarCheckinTimeline');
    let filtered = checkins.filter(c => c.travelPlanId === currentPlanId);
    if (currentCheckinFilter === 'image') filtered = filtered.filter(c => c.image);
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filtered.length === 0) { container.innerHTML = '<div class="empty-state py-6"><i class="fas fa-map-pin text-2xl"></i><p class="text-sm mt-2">暂无打卡记录</p></div>'; return; }
    container.innerHTML = filtered.map((checkin, index) => `
        <div class="checkin-item animate-slide-in-left" style="animation-delay: ${index * 0.08}s" onclick="viewCheckinDetail(${checkin.id})">
            ${checkin.image ? `<div class="w-full h-20 rounded-lg mb-2 bg-cover bg-center" style="background-image: url('${checkin.image}')"></div>` : ''}
            <div class="flex items-center gap-2 mb-1"><i class="fas fa-map-pin text-primary text-xs"></i><span class="text-sm font-semibold text-gray-800">${checkin.location}</span></div>
            <p class="text-xs text-gray-500 mb-1"><i class="far fa-calendar mr-1"></i>${checkin.date}</p>
            <p class="text-xs text-gray-600 line-clamp-2">${checkin.description || ''}</p>
        </div>
    `).join('');
}

function filterCheckins(filter, element) {
    currentCheckinFilter = filter;
    document.getElementById('sidebarCheckins').querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    element.classList.add('active');
    renderSidebarCheckins();
}

function saveCheckin(event) {
    event.preventDefault();
    try {
        const checkinData = {
            location: document.getElementById('checkinLocation').value,
            date: document.getElementById('checkinDate').value,
            description: document.getElementById('checkinDescription').value,
            imageUrl: document.getElementById('checkinImage').value
        };
        if (!checkinData.location || !checkinData.date) {
            showToast('请填写打卡地点和日期');
            return;
        }
        apiAddCheckin(currentPlanId, checkinData).then((res) => {
            if (res.data) {
                checkins.unshift({
                    id: res.data.id,
                    travelPlanId: currentPlanId,
                    location: res.data.location || checkinData.location,
                    date: (res.data.date || checkinData.date).split('T')[0],
                    description: res.data.description || checkinData.description,
                    image: res.data.imageUrl || checkinData.imageUrl
                });
            }
            closeModal('checkin');
            renderSidebarCheckins();
            updateSidebarCounts();
            showToast('打卡记录已添加！');
        }).catch(err => {
            console.error('添加打卡失败:', err);
            showToast('添加失败: ' + err.message);
        });
    } catch (err) {
        console.error('保存打卡错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function viewCheckinDetail(id) {
    const checkin = checkins.find(c => c.id === id);
    if (!checkin) return;
    document.getElementById('detailModalTitle').textContent = checkin.location;
    document.getElementById('detailContent').innerHTML = `
        <div class="space-y-4">
            ${checkin.image ? `<div class="rounded-xl overflow-hidden h-56 bg-cover bg-center" style="background-image: url('${checkin.image}')"></div>` : ''}
            <div class="flex items-center gap-3 text-sm"><span class="text-gray-500"><i class="far fa-calendar mr-1"></i>${checkin.date}</span><span class="text-gray-500"><i class="fas fa-map-pin mr-1 text-primary"></i>${checkin.location}</span></div>
            <p class="text-sm text-gray-600 leading-relaxed">${checkin.description || ''}</p>
        </div>
    `;
    openModal('detail');
}

// ==================== 侧边栏 - 美食收录 ====================
function renderSidebarFoods() {
    const container = document.getElementById('sidebarFoodList');
    let filtered = foods.filter(f => f.travelPlanId === currentPlanId);
    if (currentFoodFilter !== 'all') filtered = filtered.filter(f => f.category === currentFoodFilter);
    if (filtered.length === 0) { container.innerHTML = '<div class="empty-state py-6"><i class="fas fa-utensils text-2xl"></i><p class="text-sm mt-2">暂无美食收录</p></div>'; return; }
    container.innerHTML = filtered.map((food, index) => {
        const stars = '⭐'.repeat(food.rating);
        const categoryMap = { local: { label: '本地特色', color: 'bg-orange-100 text-orange-700' }, snack: { label: '小吃', color: 'bg-yellow-100 text-yellow-700' }, restaurant: { label: '餐厅', color: 'bg-red-100 text-red-700' } };
        const cat = categoryMap[food.category] || categoryMap.local;
        return `
            <div class="food-card animate-slide-in-right" style="animation-delay: ${index * 0.08}s" onclick="viewFoodDetail(${food.id})">
                ${food.image ? `<div class="food-image" style="background-image: url('${food.image}')"></div>` : ''}
                <div class="flex items-start justify-between mb-2"><div><h4 class="text-sm font-bold text-gray-800">${food.name}</h4><p class="text-xs text-gray-500 mt-0.5"><i class="fas fa-map-marker-alt mr-1 text-sunset"></i>${food.address}</p></div><span class="tag ${cat.color}">${cat.label}</span></div>
                <div class="flex items-center justify-between"><div class="star-rating">${stars}</div><span class="text-sm font-semibold text-sunset">¥${food.price}/人</span></div>
            </div>
        `;
    }).join('');
}

function filterFoods(filter, element) {
    currentFoodFilter = filter;
    document.getElementById('sidebarFoods').querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    element.classList.add('active');
    renderSidebarFoods();
}

function saveFood(event) {
    event.preventDefault();
    try {
        const foodData = {
            name: document.getElementById('foodName').value,
            address: document.getElementById('foodAddress').value,
            rating: parseInt(document.getElementById('foodRating').value) || 3,
            category: document.getElementById('foodCategory').value,
            pricePerPerson: parseInt(document.getElementById('foodPrice').value) || 0,
            dishes: document.getElementById('foodDishes').value,
            imageUrl: document.getElementById('foodImage').value,
            mapX: Math.floor(Math.random() * 70) + 10,
            mapY: Math.floor(Math.random() * 70) + 10
        };
        if (!foodData.name || !foodData.address) {
            showToast('请填写店铺名称和地址');
            return;
        }
        apiAddFood(currentPlanId, foodData).then((res) => {
            if (res.data) {
                foods.unshift({
                    id: res.data.id,
                    travelPlanId: currentPlanId,
                    name: res.data.name || foodData.name,
                    address: res.data.address || foodData.address,
                    rating: res.data.rating || foodData.rating,
                    category: res.data.category || foodData.category,
                    price: res.data.pricePerPerson || foodData.pricePerPerson,
                    dishes: res.data.dishes || foodData.dishes,
                    image: res.data.imageUrl || foodData.imageUrl,
                    mapX: res.data.mapX || foodData.mapX,
                    mapY: res.data.mapY || foodData.mapY
                });
            }
            closeModal('food');
            renderSidebarFoods();
            renderSidebarMap();
            updateSidebarCounts();
            showToast('美食收录已添加！');
        }).catch(err => {
            console.error('添加美食失败:', err);
            showToast('添加失败: ' + err.message);
        });
    } catch (err) {
        console.error('保存美食错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function viewFoodDetail(id) {
    const food = foods.find(f => f.id === id);
    if (!food) return;
    const stars = '⭐'.repeat(food.rating);
    const categoryMap = { local: '本地特色', snack: '小吃', restaurant: '餐厅' };
    document.getElementById('detailModalTitle').textContent = food.name;
    document.getElementById('detailContent').innerHTML = `
        <div class="space-y-4">
            ${food.image ? `<div class="rounded-xl overflow-hidden h-48 bg-cover bg-center" style="background-image: url('${food.image}')"></div>` : ''}
            <div class="flex items-center gap-3"><span class="tag bg-orange-100 text-orange-700">${categoryMap[food.category] || '其他'}</span><span class="star-rating">${stars}</span></div>
            <div class="grid grid-cols-2 gap-4 text-sm"><div class="bg-gray-50 rounded-lg p-3"><p class="text-gray-500">地址</p><p class="font-semibold mt-1"><i class="fas fa-map-marker-alt mr-1 text-sunset"></i>${food.address}</p></div><div class="bg-gray-50 rounded-lg p-3"><p class="text-gray-500">人均消费</p><p class="font-semibold mt-1 text-sunset">¥${food.price}/人</p></div></div>
            ${food.dishes ? `<div><p class="text-sm font-medium text-gray-700 mb-2">推荐菜品</p><p class="text-sm text-gray-600"><i class="fas fa-concierge-bell mr-1 text-sunset"></i>${food.dishes}</p></div>` : ''}
        </div>
    `;
    openModal('detail');
}

// ==================== 侧边栏 - 地图 ====================
function renderSidebarMap() {
    const container = document.getElementById('sidebarMapContainer');
    const planFoods = foods.filter(f => f.travelPlanId === currentPlanId);
    const markers = planFoods.map(food => `<div class="map-marker" style="left: ${food.mapX}%; top: ${food.mapY}%" onclick="viewFoodDetail(${food.id})" title="${food.name}"><span class="marker-label">${food.name}</span></div>`).join('');
    const gridLines = [];
    for (let i = 1; i < 10; i++) { gridLines.push(`<div class="map-grid-line map-grid-h" style="top: ${i * 10}%"></div>`); gridLines.push(`<div class="map-grid-line map-grid-v" style="left: ${i * 10}%"></div>`); }
    container.innerHTML = `${gridLines.join('')}<div style="position:absolute;top:45%;left:0;right:0;height:2px;background:rgba(14,165,233,0.15);transform:rotate(-5deg)"></div><div style="position:absolute;top:0;bottom:0;left:55%;width:2px;background:rgba(14,165,233,0.15);transform:rotate(3deg)"></div>${markers}<div class="map-legend"><div class="map-legend-item"><div class="map-legend-dot" style="background:#F43F5E"></div><span>美食地点</span></div></div>`;
}

function updateSidebarCounts() {
    document.getElementById('sidebarCheckinCount').textContent = checkins.filter(c => c.travelPlanId === currentPlanId).length;
    document.getElementById('sidebarFoodCount').textContent = foods.filter(f => f.travelPlanId === currentPlanId).length;
}

// ==================== 旅行计划CRUD ====================
function saveTravelPlan(event) {
    event.preventDefault();
    try {
        const editId = document.getElementById('travelEditId').value;
        const data = {
            title: document.getElementById('travelTitle').value,
            destination: document.getElementById('travelDestination').value,
            startDate: document.getElementById('travelStartDate').value,
            endDate: document.getElementById('travelEndDate').value,
            budget: parseInt(document.getElementById('travelBudget').value) || 0,
            status: document.getElementById('travelStatus').value,
            description: document.getElementById('travelDescription').value,
            imageUrl: document.getElementById('travelImage').value,
        };
        if (!data.title || !data.destination || !data.startDate || !data.endDate) {
            showToast('请填写所有必填项');
            return;
        }
        if (editId) {
            apiUpdatePlan(parseInt(editId), data).then(() => {
                const index = travelPlans.findIndex(p => p.id === parseInt(editId));
                if (index !== -1) travelPlans[index] = { ...travelPlans[index], ...data };
                closeModal('travel');
                document.getElementById('editorTitle').textContent = data.title;
                document.getElementById('editorSubtitle').textContent = data.destination;
                renderTravelPlans();
                updateStats();
                showToast('旅行计划已更新！');
            }).catch(err => {
                console.error('更新计划失败:', err);
                showToast('更新失败: ' + err.message);
            });
        } else {
            apiCreatePlan(data).then((res) => {
                if (res.data) {
                    travelPlans.unshift(res.data);
                    closeModal('travel');
                    renderTravelPlans();
                    updateStats();
                    showToast('旅行计划已添加！');
                    navigateToDetail(res.data.id);
                }
            }).catch(err => {
                console.error('添加计划失败:', err);
                showToast('添加失败: ' + err.message);
            });
        }
    } catch (err) {
        console.error('保存计划错误:', err);
        showToast('保存失败: ' + err.message);
    }
}

function editTravelPlan(id) {
    const plan = travelPlans.find(p => p.id === id);
    if (!plan) return;
    document.getElementById('travelEditId').value = id;
    document.getElementById('travelModalTitle').textContent = '编辑旅行计划';
    document.getElementById('travelTitle').value = plan.title;
    document.getElementById('travelDestination').value = plan.destination;
    document.getElementById('travelStartDate').value = plan.startDate.split('T')[0];
    document.getElementById('travelEndDate').value = plan.endDate.split('T')[0];
    document.getElementById('travelBudget').value = plan.budget;
    document.getElementById('travelStatus').value = plan.status;
    document.getElementById('travelDescription').value = plan.description || '';
    document.getElementById('travelImage').value = plan.imageUrl || '';
    openModal('travel');
}

function deleteTravelPlan(id) {
    if (!confirm('确定要删除这个旅行计划吗？关联的打卡记录和美食也将被删除。')) return;
    travelPlans = travelPlans.filter(p => p.id !== id);
    checkins = checkins.filter(c => c.travelPlanId !== id);
    foods = foods.filter(f => f.travelPlanId !== id);
    routeSpots = routeSpots.filter(s => s.travelPlanId !== id);
    scheduleItems = scheduleItems.filter(s => s.travelPlanId !== id);
    spotDetails = spotDetails.filter(s => s.travelPlanId !== id);
    transports = transports.filter(t => t.travelPlanId !== id);
    accommodations = accommodations.filter(a => a.travelPlanId !== id);
    expenses = expenses.filter(e => e.travelPlanId !== id);
    todos = todos.filter(t => t.travelPlanId !== id);
    if (currentPlanId === id) goBack();
    apiDeletePlan(id).then(() => {
        renderTravelPlans();
        updateStats();
    }).catch(err => showToast('删除失败: ' + err.message));
    showToast('旅行计划已删除');
}

// ==================== 可拖动分隔线 ====================
function initResizer() {
    const resizer = document.getElementById('resizer');
    const editorPanel = document.getElementById('editorPanel');
    const sidebarPanel = document.getElementById('sidebarPanel');
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => { isResizing = true; resizer.classList.add('resizing'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; });
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const container = document.getElementById('editorMainContent');
        const containerRect = container.getBoundingClientRect();
        const newEditorWidth = e.clientX - containerRect.left;
        const newSidebarWidth = containerRect.right - e.clientX;
        if (newEditorWidth > 400 && newSidebarWidth > 280) { editorPanel.style.flex = 'none'; editorPanel.style.width = newEditorWidth + 'px'; sidebarPanel.style.width = newSidebarWidth + 'px'; }
    });
    document.addEventListener('mouseup', () => { if (isResizing) { isResizing = false; resizer.classList.remove('resizing'); document.body.style.cursor = ''; document.body.style.userSelect = ''; } });
}

// ==================== 自动保存 ====================
function autoSave() {
    const status = document.getElementById('saveStatus');
    status.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>保存中...';
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => { status.innerHTML = '<i class="fas fa-check-circle mr-1"></i>已保存'; }, 1000);
}

// ==================== 弹窗控制 ====================
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.add('active');
        if (type === 'travel' && !document.getElementById('travelEditId').value) { document.getElementById('travelModalTitle').textContent = '添加旅行计划'; document.getElementById('travelForm').reset(); }
        if (type === 'checkin') document.getElementById('checkinForm').reset();
        if (type === 'food') document.getElementById('foodForm').reset();
        if (type === 'spotEdit') { document.getElementById('spotEditForm').reset(); document.getElementById('spotEditId').value = ''; document.getElementById('spotEditModalTitle').textContent = '添加景点'; }
        if (type === 'schedule') { document.getElementById('scheduleForm').reset(); document.getElementById('scheduleEditId').value = ''; }
        if (type === 'transport') { document.getElementById('transportForm').reset(); document.getElementById('transportEditId').value = ''; }
        if (type === 'accommodation') { document.getElementById('accommodationForm').reset(); document.getElementById('accommodationEditId').value = ''; }
        if (type === 'expense') { document.getElementById('expenseForm').reset(); document.getElementById('expenseEditId').value = ''; }
        if (type === 'todo') { document.getElementById('todoForm').reset(); document.getElementById('todoEditId').value = ''; }
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.classList.remove('active');
    if (type === 'travel') document.getElementById('travelEditId').value = '';
    if (type === 'schedule') document.getElementById('scheduleEditId').value = '';
    if (type === 'transport') document.getElementById('transportEditId').value = '';
    if (type === 'accommodation') document.getElementById('accommodationEditId').value = '';
    if (type === 'expense') document.getElementById('expenseEditId').value = '';
    if (type === 'todo') document.getElementById('todoEditId').value = '';
    if (type === 'spotEdit') document.getElementById('spotEditId').value = '';
}

document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) { if (e.target === this) { this.classList.remove('active'); document.getElementById('travelEditId').value = ''; } });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay.active').forEach(modal => modal.classList.remove('active')); document.getElementById('travelEditId').value = ''; }
});

// ==================== Toast 提示 ====================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium animate-fade-in-up';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 2000);
}

// ==================== 退出登录 ====================
function handleLogout() {
    if (!confirm('确定要退出登录吗？')) return;
    clearAuth();
    showToast('已退出登录');
    setTimeout(() => {
        window.location.href = 'landing.html';
    }, 500);
}
