// ==================== 数据存储 ====================
let travelPlans = [
    { id: 1, title: '大理洱海之旅', destination: '云南大理', startDate: '2025-08-15', endDate: '2025-08-22', budget: 5000, spent: 3200, status: 'ongoing', description: '环洱海骑行，探访白族村落，感受苍山洱海的壮美。', image: 'https://images.unsplash.com/photo-1571401835390-9a15d78d3410?w=800' },
    { id: 2, title: '京都文化探索', destination: '日本京都', startDate: '2025-10-01', endDate: '2025-10-07', budget: 12000, spent: 0, status: 'planned', description: '游览金阁寺、清水寺、伏见稻荷大社等著名景点。', image: 'https://images.unsplash.com/photo-1493976040374-85c8e1de901c?w=800' },
    { id: 3, title: '三亚海滨度假', destination: '海南三亚', startDate: '2025-03-10', endDate: '2025-03-15', budget: 6000, spent: 5800, status: 'completed', description: '在亚龙湾享受阳光沙滩，体验潜水、冲浪等水上活动。', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { id: 4, title: '成都美食之旅', destination: '四川成都', startDate: '2025-12-20', endDate: '2025-12-25', budget: 4000, spent: 0, status: 'planned', description: '品尝正宗川菜，探访宽窄巷子、锦里，看大熊猫。', image: 'https://images.unsplash.com/photo-1567604657472-4169e31e08ea?w=800' }
];

let checkins = [
    { id: 1, travelPlanId: 1, location: '洱海生态廊道', date: '2025-08-16', description: '清晨的洱海美得像一幅画，阳光洒在湖面上波光粼粼。', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { id: 2, travelPlanId: 1, location: '双廊古镇', date: '2025-08-17', description: '双廊的小巷子里藏着许多有趣的小店。', image: '' },
    { id: 3, travelPlanId: 1, location: '崇圣寺三塔', date: '2025-08-18', description: '千年古塔在蓝天白云的映衬下显得格外壮观。', image: 'https://images.unsplash.com/photo-1501785888041-af3cb2d78dec?w=800' },
    { id: 4, travelPlanId: 3, location: '亚龙湾海滩', date: '2025-03-12', description: '三亚的阳光沙滩，海水清澈见底。', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
    { id: 5, travelPlanId: 3, location: '春熙路', date: '2025-03-11', description: '成都最繁华的商业街。', image: '' }
];

let foods = [
    { id: 1, travelPlanId: 1, name: '段氏酸菜鱼', address: '大理古城人民路下段', rating: 5, category: 'local', price: 85, dishes: '酸菜鱼、乳扇、饵块', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', mapX: 25, mapY: 35 },
    { id: 2, travelPlanId: 1, name: '喜洲粑粑铺', address: '喜洲古镇中心', rating: 4, category: 'snack', price: 15, dishes: '喜洲粑粑（甜/咸）', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', mapX: 55, mapY: 50 },
    { id: 3, travelPlanId: 1, name: '双廊海景餐厅', address: '双廊古镇玉几岛', rating: 4, category: 'restaurant', price: 120, dishes: '酸辣鱼、黄焖鸡', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', mapX: 75, mapY: 25 },
    { id: 4, travelPlanId: 1, name: '再回首小吃', address: '大理古城博爱路', rating: 3, category: 'snack', price: 25, dishes: '凉鸡米线、豌豆粉', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', mapX: 40, mapY: 70 },
    { id: 5, travelPlanId: 3, name: '三亚海鲜大排档', address: '三亚第一市场', rating: 4, category: 'local', price: 150, dishes: '清蒸石斑、白灼虾', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', mapX: 30, mapY: 45 }
];

let routeSpots = [
    { id: 1, travelPlanId: 1, name: '洱海生态廊道', order: 1, distance: 0, duration: 0 },
    { id: 2, travelPlanId: 1, name: '双廊古镇', order: 2, distance: 35, duration: 45 },
    { id: 3, travelPlanId: 1, name: '崇圣寺三塔', order: 3, distance: 20, duration: 30 },
    { id: 4, travelPlanId: 1, name: '喜洲古镇', order: 4, distance: 18, duration: 25 }
];

let scheduleItems = [
    { id: 1, travelPlanId: 1, date: '2025-08-15', startTime: '09:00', endTime: '12:00', title: '抵达大理，入住酒店', description: '从昆明乘坐高铁抵达大理', type: 'transport' },
    { id: 2, travelPlanId: 1, date: '2025-08-15', startTime: '14:00', endTime: '17:00', title: '游览古城', description: '漫步大理古城，感受白族文化', type: 'sightseeing' },
    { id: 3, travelPlanId: 1, date: '2025-08-16', startTime: '08:00', endTime: '12:00', title: '环洱海骑行', description: '从才村码头出发，沿生态廊道骑行', type: 'activity' }
];

let spotDetails = [
    { id: 1, travelPlanId: 1, name: '洱海', description: '云南第二大淡水湖，被誉为"高原明珠"。环湖一周约120公里，沿途风光旖旎。', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', hours: '全天开放', ticket: '免费', contact: '0872-2672987' },
    { id: 2, travelPlanId: 1, name: '崇圣寺三塔', description: '大理标志性建筑，始建于唐代，已有1000多年历史。', image: 'https://images.unsplash.com/photo-1501785888041-af3cb2d78dec?w=800', hours: '08:00-18:00', ticket: '¥75', contact: '0872-2670497' },
    { id: 3, travelPlanId: 1, name: '双廊古镇', description: '被誉为"大理风光在苍山，苍山风光在双廊"。', image: '', hours: '全天开放', ticket: '免费', contact: '' }
];

let transports = [
    { id: 1, travelPlanId: 1, type: '高铁', from: '昆明', to: '大理', time: '2025-08-15 08:30', cost: 145, note: 'D字头动车，约2小时' },
    { id: 2, travelPlanId: 1, type: '租车', from: '大理古城', to: '环洱海', time: '2025-08-16', cost: 200, note: '电动车环湖，租2天' }
];

let accommodations = [
    { id: 1, travelPlanId: 1, name: '大理洱海海景酒店', address: '大理市洱海边', checkIn: '2025-08-15', checkOut: '2025-08-22', price: 380, note: '海景房，含早餐' }
];

let expenses = [
    { id: 1, travelPlanId: 1, category: '交通', amount: 345, date: '2025-08-15', note: '高铁+租车' },
    { id: 2, travelPlanId: 1, category: '住宿', amount: 2660, date: '2025-08-15', note: '7晚海景房' },
    { id: 3, travelPlanId: 1, category: '餐饮', amount: 195, date: '2025-08-16', note: '3餐' }
];

let todos = [
    { id: 1, travelPlanId: 1, text: '预订返程车票', completed: false },
    { id: 2, travelPlanId: 1, text: '购买防晒霜和墨镜', completed: true },
    { id: 3, travelPlanId: 1, text: '准备骑行装备', completed: false }
];

let nextId = 100;
let currentPlanId = null;
let currentCheckinFilter = 'all';
let currentFoodFilter = 'all';
let currentEditorTab = 'route';
let currentSidebarTab = 'checkins';
let currentScheduleDate = '2025-08-15';
let autoSaveTimer = null;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    renderTravelPlans();
    updateStats();
    initResizer();
});

// ==================== 主页面：旅行计划列表 ====================
function renderTravelPlans() {
    const container = document.getElementById('travelPlanList');
    const emptyState = document.getElementById('emptyState');
    if (travelPlans.length === 0) { container.innerHTML = ''; emptyState.classList.remove('hidden'); return; }
    emptyState.classList.add('hidden');

    const statusMap = { planned: { label: '计划中', class: 'status-planned', icon: 'fa-calendar' }, ongoing: { label: '进行中', class: 'status-ongoing', icon: 'fa-play' }, completed: { label: '已完成', class: 'status-completed', icon: 'fa-check' } };

    container.innerHTML = travelPlans.map((plan, index) => {
        const status = statusMap[plan.status];
        const progress = plan.budget > 0 ? Math.min((plan.spent / plan.budget) * 100, 100) : 0;
        const days = Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24)) + 1;
        const checkinCount = checkins.filter(c => c.travelPlanId === plan.id).length;
        const foodCount = foods.filter(f => f.travelPlanId === plan.id).length;

        return `
            <div class="travel-card animate-fade-in-up" style="animation-delay: ${index * 0.1}s" onclick="navigateToDetail(${plan.id})">
                <div class="card-click-hint"><i class="fas fa-arrow-right mr-1"></i>进入编辑</div>
                <div class="card-image" style="background-image: url('${plan.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}')">
                    <span class="location-text"><i class="fas fa-map-marker-alt mr-1"></i>${plan.destination}</span>
                </div>
                <div class="p-5">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${plan.title}</h3>
                            <p class="text-xs text-gray-500 mt-1"><i class="far fa-calendar-alt mr-1"></i>${plan.startDate} 至 ${plan.endDate} · ${days}天</p>
                        </div>
                        <span class="status-badge ${status.class}"><i class="fas ${status.icon} text-xs"></i>${status.label}</span>
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-4">${plan.description}</p>
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
    if (!plan) return;

    document.getElementById('editorTitle').textContent = plan.title;
    document.getElementById('editorSubtitle').textContent = plan.destination + ' · ' + plan.startDate + ' 至 ' + plan.endDate;

    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('editorPage').classList.remove('hidden');

    renderAll();
    switchEditorTab('route');
    switchSidebarTab('checkins');
}

function goBack() {
    document.getElementById('editorPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    currentPlanId = null;
    renderTravelPlans();
    updateStats();
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
    routeSpots.push({ id: nextId++, travelPlanId: currentPlanId, name, order: routeSpots.filter(s => s.travelPlanId === currentPlanId).length + 1, distance: Math.floor(Math.random() * 30) + 5, duration: Math.floor(Math.random() * 40) + 15 });
    input.value = '';
    renderRouteList();
    showToast('景点已添加');
    autoSave();
}

function deleteSpot(id) {
    if (!confirm('确定要删除这个景点吗？')) return;
    routeSpots = routeSpots.filter(s => s.id !== id);
    const planSpots = routeSpots.filter(s => s.travelPlanId === currentPlanId).sort((a, b) => a.order - b.order);
    planSpots.forEach((s, i) => s.order = i + 1);
    renderRouteList();
    showToast('景点已删除');
    autoSave();
}

function moveSpot(id, direction) {
    const spots = routeSpots.filter(s => s.travelPlanId === currentPlanId).sort((a, b) => a.order - b.order);
    const index = spots.findIndex(s => s.id === id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= spots.length) return;
    const tempOrder = spots[index].order;
    spots[index].order = spots[newIndex].order;
    spots[newIndex].order = tempOrder;
    renderRouteList();
    autoSave();
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
    renderRouteList();
    autoSave();
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
            <div class="schedule-info"><h4>${item.title}</h4><p>${item.description}</p></div>
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
    const titles = ['游览景点', '品尝美食', '休息调整', '购物时间', '自由活动'];
    const types = ['sightseeing', 'food', 'other', 'other', 'other'];
    const idx = Math.floor(Math.random() * titles.length);
    const startHour = 8 + Math.floor(Math.random() * 8);
    scheduleItems.push({ id: nextId++, travelPlanId: currentPlanId, date: currentScheduleDate, startTime: `${String(startHour).padStart(2, '0')}:00`, endTime: `${String(startHour + 2).padStart(2, '0')}:00`, title: titles[idx], description: '点击编辑详细信息', type: types[idx] });
    renderScheduleList();
    showToast('活动已添加');
    autoSave();
}

function editScheduleItem(id) {
    const item = scheduleItems.find(s => s.id === id);
    if (!item) return;
    const newTitle = prompt('活动名称：', item.title);
    if (newTitle !== null) { item.title = newTitle; const newDesc = prompt('活动描述：', item.description); if (newDesc !== null) item.description = newDesc; renderScheduleList(); autoSave(); }
}

function deleteScheduleItem(id) {
    if (!confirm('确定要删除这个活动吗？')) return;
    scheduleItems = scheduleItems.filter(s => s.id !== id);
    renderScheduleList();
    showToast('活动已删除');
    autoSave();
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
    spotDetails.push({ id: nextId++, travelPlanId: currentPlanId, name: '新景点', description: '', image: '', hours: '', ticket: '', contact: '' });
    renderSpotsCards();
    openSpotEdit(spotDetails[spotDetails.length - 1].id);
}

function openSpotEdit(id) {
    const spot = spotDetails.find(s => s.id === id);
    if (!spot) return;
    document.getElementById('spotEditId').value = id;
    document.getElementById('spotEditModalTitle').textContent = '编辑景点';
    document.getElementById('spotEditName').value = spot.name;
    document.getElementById('spotEditDescription').value = spot.description;
    document.getElementById('spotEditImage').value = spot.image;
    document.getElementById('spotEditHours').value = spot.hours;
    document.getElementById('spotEditTicket').value = spot.ticket;
    document.getElementById('spotEditContact').value = spot.contact;
    openModal('spotEdit');
}

function saveSpotDetail(event) {
    event.preventDefault();
    const editId = document.getElementById('spotEditId').value;
    const data = {
        name: document.getElementById('spotEditName').value,
        description: document.getElementById('spotEditDescription').value,
        image: document.getElementById('spotEditImage').value,
        hours: document.getElementById('spotEditHours').value,
        ticket: document.getElementById('spotEditTicket').value,
        contact: document.getElementById('spotEditContact').value
    };
    if (!data.name) { showToast('请输入景点名称'); return; }
    if (editId) {
        const spot = spotDetails.find(s => s.id === parseInt(editId));
        if (spot) Object.assign(spot, data);
    } else {
        spotDetails.push({ id: nextId++, travelPlanId: currentPlanId, ...data });
    }
    closeModal('spotEdit');
    renderSpotsCards();
    showToast('景点信息已保存');
    autoSave();
}

function deleteSpotDetail(id) {
    if (!confirm('确定要删除这个景点吗？')) return;
    spotDetails = spotDetails.filter(s => s.id !== id);
    renderSpotsCards();
    showToast('景点已删除');
    autoSave();
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
            <div class="detail-item-info"><h4>${item.type}: ${item.from} → ${item.to}</h4><p>${item.time} · ¥${item.cost} · ${item.note}</p></div>
            <div class="detail-item-actions"><button class="delete-btn" onclick="deleteTransport(${item.id})"><i class="fas fa-trash-alt"></i></button></div>
        </div>
    `).join('');
}

function addTransport() {
    transports.push({ id: nextId++, travelPlanId: currentPlanId, type: '其他', from: '出发地', to: '目的地', time: '2025-08-15', cost: 0, note: '点击编辑' });
    renderTransportList(); showToast('交通记录已添加'); autoSave();
}
function deleteTransport(id) { transports = transports.filter(t => t.id !== id); renderTransportList(); autoSave(); }

// ==================== 住宿 ====================
function renderAccommodationList() {
    const container = document.getElementById('accommodationList');
    const items = accommodations.filter(a => a.travelPlanId === currentPlanId);
    if (items.length === 0) { container.innerHTML = '<p class="text-sm text-gray-400 text-center py-4">暂无住宿记录</p>'; return; }
    container.innerHTML = items.map(item => `
        <div class="detail-item">
            <div class="detail-item-icon" style="background: #e0e7ff; color: #6366F1;"><i class="fas fa-hotel"></i></div>
            <div class="detail-item-info"><h4>${item.name}</h4><p>${item.address} · ${item.checkIn} 至 ${item.checkOut} · ¥${item.price}/晚</p><p class="text-xs mt-1">${item.note}</p></div>
            <div class="detail-item-actions"><button class="delete-btn" onclick="deleteAccommodation(${item.id})"><i class="fas fa-trash-alt"></i></button></div>
        </div>
    `).join('');
}

function addAccommodation() {
    accommodations.push({ id: nextId++, travelPlanId: currentPlanId, name: '新住宿', address: '地址待填写', checkIn: '2025-08-15', checkOut: '2025-08-16', price: 0, note: '点击编辑' });
    renderAccommodationList(); showToast('住宿记录已添加'); autoSave();
}
function deleteAccommodation(id) { accommodations = accommodations.filter(a => a.id !== id); renderAccommodationList(); autoSave(); }

// ==================== 预算管理 ====================
function renderBudgetSummary() {
    const plan = travelPlans.find(p => p.id === currentPlanId);
    const totalExpense = expenses.filter(e => e.travelPlanId === currentPlanId).reduce((sum, e) => sum + e.amount, 0);
    const budget = plan ? plan.budget : 0;
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
            <div class="detail-item-info"><h4>${item.category} - ¥${item.amount}</h4><p>${item.date} · ${item.note}</p></div>
            <div class="detail-item-actions"><button class="delete-btn" onclick="deleteExpense(${item.id})"><i class="fas fa-trash-alt"></i></button></div>
        </div>
    `).join('');
}

function addExpense() {
    expenses.push({ id: nextId++, travelPlanId: currentPlanId, category: '其他', amount: 0, date: '2025-08-15', note: '点击编辑' });
    renderExpenseList(); renderBudgetSummary(); showToast('费用记录已添加'); autoSave();
}
function deleteExpense(id) { expenses = expenses.filter(e => e.id !== id); renderExpenseList(); renderBudgetSummary(); autoSave(); }

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

function toggleTodo(id) { const todo = todos.find(t => t.id === id); if (todo) todo.completed = !todo.completed; renderTodoList(); autoSave(); }
function addTodo() { const text = prompt('待办事项：'); if (!text) return; todos.push({ id: nextId++, travelPlanId: currentPlanId, text, completed: false }); renderTodoList(); showToast('待办事项已添加'); autoSave(); }
function deleteTodo(id) { todos = todos.filter(t => t.id !== id); renderTodoList(); autoSave(); }

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
            <p class="text-xs text-gray-600 line-clamp-2">${checkin.description}</p>
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
    checkins.unshift({ id: nextId++, travelPlanId: currentPlanId, location: document.getElementById('checkinLocation').value, date: document.getElementById('checkinDate').value, description: document.getElementById('checkinDescription').value, image: document.getElementById('checkinImage').value });
    closeModal('checkin'); renderSidebarCheckins(); updateSidebarCounts(); showToast('打卡记录已添加！');
}

function viewCheckinDetail(id) {
    const checkin = checkins.find(c => c.id === id);
    if (!checkin) return;
    document.getElementById('detailModalTitle').textContent = checkin.location;
    document.getElementById('detailContent').innerHTML = `
        <div class="space-y-4">
            ${checkin.image ? `<div class="rounded-xl overflow-hidden h-56 bg-cover bg-center" style="background-image: url('${checkin.image}')"></div>` : ''}
            <div class="flex items-center gap-3 text-sm"><span class="text-gray-500"><i class="far fa-calendar mr-1"></i>${checkin.date}</span><span class="text-gray-500"><i class="fas fa-map-pin mr-1 text-primary"></i>${checkin.location}</span></div>
            <p class="text-sm text-gray-600 leading-relaxed">${checkin.description}</p>
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
        const cat = categoryMap[food.category];
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
    foods.unshift({ id: nextId++, travelPlanId: currentPlanId, name: document.getElementById('foodName').value, address: document.getElementById('foodAddress').value, rating: parseInt(document.getElementById('foodRating').value), category: document.getElementById('foodCategory').value, price: parseInt(document.getElementById('foodPrice').value) || 0, dishes: document.getElementById('foodDishes').value, image: document.getElementById('foodImage').value, mapX: Math.floor(Math.random() * 70) + 10, mapY: Math.floor(Math.random() * 70) + 10 });
    closeModal('food'); renderSidebarFoods(); renderSidebarMap(); updateSidebarCounts(); showToast('美食收录已添加！');
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
            <div class="flex items-center gap-3"><span class="tag bg-orange-100 text-orange-700">${categoryMap[food.category]}</span><span class="star-rating">${stars}</span></div>
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

// ==================== 旅行计划 CRUD ====================
function saveTravelPlan(event) {
    event.preventDefault();
    const editId = document.getElementById('travelEditId').value;
    const data = { title: document.getElementById('travelTitle').value, destination: document.getElementById('travelDestination').value, startDate: document.getElementById('travelStartDate').value, endDate: document.getElementById('travelEndDate').value, budget: parseInt(document.getElementById('travelBudget').value) || 0, status: document.getElementById('travelStatus').value, description: document.getElementById('travelDescription').value, image: document.getElementById('travelImage').value };
    if (editId) { const index = travelPlans.findIndex(p => p.id === parseInt(editId)); if (index !== -1) travelPlans[index] = { ...travelPlans[index], ...data }; }
    else { data.id = nextId++; data.spent = 0; travelPlans.unshift(data); }
    closeModal('travel');
    if (currentPlanId) { document.getElementById('editorTitle').textContent = data.title; document.getElementById('editorSubtitle').textContent = data.destination; }
    renderTravelPlans(); updateStats();
    showToast(editId ? '旅行计划已更新！' : '旅行计划已添加！');
}

function editTravelPlan(id) {
    const plan = travelPlans.find(p => p.id === id);
    if (!plan) return;
    document.getElementById('travelEditId').value = id;
    document.getElementById('travelModalTitle').textContent = '编辑旅行计划';
    document.getElementById('travelTitle').value = plan.title;
    document.getElementById('travelDestination').value = plan.destination;
    document.getElementById('travelStartDate').value = plan.startDate;
    document.getElementById('travelEndDate').value = plan.endDate;
    document.getElementById('travelBudget').value = plan.budget;
    document.getElementById('travelStatus').value = plan.status;
    document.getElementById('travelDescription').value = plan.description;
    document.getElementById('travelImage').value = plan.image || '';
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
    renderTravelPlans(); updateStats();
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
        if (type === 'spotEdit') { document.getElementById('spotEditForm').reset(); document.getElementById('spotEditId').value = ''; }
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.classList.remove('active');
    if (type === 'travel') document.getElementById('travelEditId').value = '';
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
