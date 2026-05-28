// ==================== 数据存储 ====================
let travelPlans = [
    {
        id: 1,
        title: '大理洱海之旅',
        destination: '云南大理',
        startDate: '2025-08-15',
        endDate: '2025-08-22',
        budget: 5000,
        spent: 3200,
        status: 'ongoing',
        description: '环洱海骑行，探访白族村落，感受苍山洱海的壮美。计划游览崇圣寺三塔、双廊古镇、喜洲白族民居等景点。',
        image: 'https://images.unsplash.com/photo-1571401835390-9a15d78d3410?w=800'
    },
    {
        id: 2,
        title: '京都文化探索',
        destination: '日本京都',
        startDate: '2025-10-01',
        endDate: '2025-10-07',
        budget: 12000,
        spent: 0,
        status: 'planned',
        description: '游览金阁寺、清水寺、伏见稻荷大社等著名景点，体验日本传统文化和美食。',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e1de901c?w=800'
    },
    {
        id: 3,
        title: '三亚海滨度假',
        destination: '海南三亚',
        startDate: '2025-03-10',
        endDate: '2025-03-15',
        budget: 6000,
        spent: 5800,
        status: 'completed',
        description: '在亚龙湾享受阳光沙滩，体验潜水、冲浪等水上活动。',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    },
    {
        id: 4,
        title: '成都美食之旅',
        destination: '四川成都',
        startDate: '2025-12-20',
        endDate: '2025-12-25',
        budget: 4000,
        spent: 0,
        status: 'planned',
        description: '品尝正宗川菜，探访宽窄巷子、锦里，看大熊猫。',
        image: 'https://images.unsplash.com/photo-1567604657472-4169e31e08ea?w=800'
    }
];

let checkins = [
    {
        id: 1,
        location: '洱海生态廊道',
        date: '2025-08-16',
        description: '清晨的洱海美得像一幅画，阳光洒在湖面上波光粼粼。骑行在生态廊道上，感受着微风拂面，心情无比舒畅。',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        year: '2025'
    },
    {
        id: 2,
        location: '双廊古镇',
        date: '2025-08-17',
        description: '双廊的小巷子里藏着许多有趣的小店，每一家都很有特色。',
        image: '',
        year: '2025'
    },
    {
        id: 3,
        location: '崇圣寺三塔',
        date: '2025-08-18',
        description: '千年古塔在蓝天白云的映衬下显得格外壮观。',
        image: 'https://images.unsplash.com/photo-1501785888041-af3cb2d78dec?w=800',
        year: '2025'
    },
    {
        id: 4,
        location: '亚龙湾海滩',
        date: '2025-03-12',
        description: '三亚的阳光沙滩，海水清澈见底，沙子细腻柔软。',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        year: '2025'
    },
    {
        id: 5,
        location: '春熙路',
        date: '2025-03-11',
        description: '成都最繁华的商业街，美食遍地。',
        image: '',
        year: '2025'
    }
];

let foods = [
    {
        id: 1,
        name: '段氏酸菜鱼',
        address: '大理古城人民路下段',
        rating: 5,
        category: 'local',
        price: 85,
        dishes: '酸菜鱼、乳扇、饵块',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        mapX: 25,
        mapY: 35
    },
    {
        id: 2,
        name: '喜洲粑粑铺',
        address: '喜洲古镇中心',
        rating: 4,
        category: 'snack',
        price: 15,
        dishes: '喜洲粑粑（甜/咸）',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        mapX: 55,
        mapY: 50
    },
    {
        id: 3,
        name: '双廊海景餐厅',
        address: '双廊古镇玉几岛',
        rating: 4,
        category: 'restaurant',
        price: 120,
        dishes: '酸辣鱼、黄焖鸡',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        mapX: 75,
        mapY: 25
    },
    {
        id: 4,
        name: '再回首小吃',
        address: '大理古城博爱路',
        rating: 3,
        category: 'snack',
        price: 25,
        dishes: '凉鸡米线、豌豆粉',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        mapX: 40,
        mapY: 70
    }
];

let nextId = 100;
let currentCheckinFilter = 'all';
let currentFoodFilter = 'all';

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    renderTravelPlans();
    renderCheckins();
    renderFoods();
    updateStats();
});

// ==================== 旅行计划相关 ====================
function renderTravelPlans() {
    const container = document.getElementById('travelPlanList');
    const emptyState = document.getElementById('emptyState');

    if (travelPlans.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    const statusMap = {
        planned: { label: '计划中', class: 'status-planned', icon: 'fa-calendar' },
        ongoing: { label: '进行中', class: 'status-ongoing', icon: 'fa-play' },
        completed: { label: '已完成', class: 'status-completed', icon: 'fa-check' }
    };

    container.innerHTML = travelPlans.map((plan, index) => {
        const status = statusMap[plan.status];
        const progress = plan.budget > 0 ? Math.min((plan.spent / plan.budget) * 100, 100) : 0;
        const days = Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24)) + 1;

        return `
            <div class="travel-card animate-fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="card-image" style="background-image: url('${plan.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}')">
                    <span class="location-text">
                        <i class="fas fa-map-marker-alt mr-1"></i>${plan.destination}
                    </span>
                </div>
                <div class="p-5">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${plan.title}</h3>
                            <p class="text-xs text-gray-500 mt-1">
                                <i class="far fa-calendar-alt mr-1"></i>
                                ${plan.startDate} 至 ${plan.endDate} · ${days}天
                            </p>
                        </div>
                        <span class="status-badge ${status.class}">
                            <i class="fas ${status.icon} text-xs"></i>
                            ${status.label}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-4">${plan.description}</p>
                    <div class="mb-4">
                        <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                            <span>预算进度</span>
                            <span>¥${plan.spent} / ¥${plan.budget}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="editTravelPlan(${plan.id})" class="flex-1 py-2 text-sm font-medium text-primary bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <i class="fas fa-edit mr-1"></i>编辑
                        </button>
                        <button onclick="viewTravelDetail(${plan.id})" class="flex-1 py-2 text-sm font-medium text-secondary bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                            <i class="fas fa-eye mr-1"></i>详情
                        </button>
                        <button onclick="deleteTravelPlan(${plan.id})" class="py-2 px-3 text-sm text-coral bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                            <i class="fas fa-trash-alt"></i>
                        </button>
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

function saveTravelPlan(event) {
    event.preventDefault();
    const editId = document.getElementById('travelEditId').value;
    const data = {
        title: document.getElementById('travelTitle').value,
        destination: document.getElementById('travelDestination').value,
        startDate: document.getElementById('travelStartDate').value,
        endDate: document.getElementById('travelEndDate').value,
        budget: parseInt(document.getElementById('travelBudget').value) || 0,
        status: document.getElementById('travelStatus').value,
        description: document.getElementById('travelDescription').value,
        image: document.getElementById('travelImage').value
    };

    if (editId) {
        const index = travelPlans.findIndex(p => p.id === parseInt(editId));
        if (index !== -1) {
            travelPlans[index] = { ...travelPlans[index], ...data };
        }
    } else {
        data.id = nextId++;
        data.spent = 0;
        travelPlans.unshift(data);
    }

    closeModal('travel');
    renderTravelPlans();
    updateStats();
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
    if (confirm('确定要删除这个旅行计划吗？此操作不可撤销。')) {
        travelPlans = travelPlans.filter(p => p.id !== id);
        renderTravelPlans();
        updateStats();
        showToast('旅行计划已删除');
    }
}

function viewTravelDetail(id) {
    const plan = travelPlans.find(p => p.id === id);
    if (!plan) return;

    const statusMap = {
        planned: { label: '计划中', class: 'status-planned' },
        ongoing: { label: '进行中', class: 'status-ongoing' },
        completed: { label: '已完成', class: 'status-completed' }
    };
    const status = statusMap[plan.status];
    const days = Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24)) + 1;

    document.getElementById('detailModalTitle').textContent = plan.title;
    document.getElementById('detailContent').innerHTML = `
        <div class="space-y-4">
            <div class="rounded-xl overflow-hidden h-48" style="background: url('${plan.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}') center/cover;"></div>
            <div class="flex items-center gap-3">
                <span class="status-badge ${status.class}"><i class="fas fa-map-marker-alt"></i> ${plan.destination}</span>
                <span class="status-badge ${status.class}">${status.label}</span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-gray-500">开始日期</p>
                    <p class="font-semibold mt-1">${plan.startDate}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-gray-500">结束日期</p>
                    <p class="font-semibold mt-1">${plan.endDate}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-gray-500">旅行天数</p>
                    <p class="font-semibold mt-1">${days}天</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-gray-500">预算</p>
                    <p class="font-semibold mt-1">¥${plan.budget.toLocaleString()}</p>
                </div>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-700 mb-2">旅行描述</p>
                <p class="text-sm text-gray-600 leading-relaxed">${plan.description}</p>
            </div>
        </div>
    `;
    openModal('detail');
}

// ==================== 打卡记录相关 ====================
function renderCheckins() {
    const container = document.getElementById('checkinTimeline');
    let filtered = checkins;

    if (currentCheckinFilter === 'image') {
        filtered = checkins.filter(c => c.image);
    } else if (currentCheckinFilter !== 'all') {
        filtered = checkins.filter(c => c.year === currentCheckinFilter);
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state py-8">
                <i class="fas fa-map-pin text-2xl"></i>
                <p class="text-sm mt-2">暂无打卡记录</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map((checkin, index) => `
        <div class="checkin-item animate-slide-in-left" style="animation-delay: ${index * 0.08}s" onclick="viewCheckinDetail(${checkin.id})">
            ${checkin.image ? `
                <div class="w-full h-24 rounded-lg mb-2 bg-cover bg-center" style="background-image: url('${checkin.image}')"></div>
            ` : ''}
            <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-map-pin text-primary text-xs"></i>
                <span class="text-sm font-semibold text-gray-800">${checkin.location}</span>
            </div>
            <p class="text-xs text-gray-500 mb-1">
                <i class="far fa-calendar mr-1"></i>${checkin.date}
            </p>
            <p class="text-xs text-gray-600 line-clamp-2">${checkin.description}</p>
        </div>
    `).join('');
}

function filterCheckins(filter, element) {
    currentCheckinFilter = filter;
    document.querySelectorAll('.left-panel .filter-chip').forEach(chip => chip.classList.remove('active'));
    element.classList.add('active');
    renderCheckins();
}

function saveCheckin(event) {
    event.preventDefault();
    const data = {
        id: nextId++,
        location: document.getElementById('checkinLocation').value,
        date: document.getElementById('checkinDate').value,
        description: document.getElementById('checkinDescription').value,
        image: document.getElementById('checkinImage').value,
        year: document.getElementById('checkinDate').value.substring(0, 4)
    };

    checkins.unshift(data);
    closeModal('checkin');
    renderCheckins();
    showToast('打卡记录已添加！');
}

function viewCheckinDetail(id) {
    const checkin = checkins.find(c => c.id === id);
    if (!checkin) return;

    document.getElementById('detailModalTitle').textContent = checkin.location;
    document.getElementById('detailContent').innerHTML = `
        <div class="space-y-4">
            ${checkin.image ? `
                <div class="rounded-xl overflow-hidden h-56 bg-cover bg-center" style="background-image: url('${checkin.image}')"></div>
            ` : ''}
            <div class="flex items-center gap-3 text-sm">
                <span class="text-gray-500"><i class="far fa-calendar mr-1"></i>${checkin.date}</span>
                <span class="text-gray-500"><i class="fas fa-map-pin mr-1 text-primary"></i>${checkin.location}</span>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-700 mb-2">打卡记录</p>
                <p class="text-sm text-gray-600 leading-relaxed">${checkin.description}</p>
            </div>
        </div>
    `;
    openModal('detail');
}

// ==================== 美食收录相关 ====================
function renderFoods() {
    const container = document.getElementById('foodList');
    const mapContainer = document.getElementById('foodMap');
    let filtered = foods;

    if (currentFoodFilter !== 'all') {
        filtered = foods.filter(f => f.category === currentFoodFilter);
    }

    // 渲染地图标记
    const markers = filtered.map(food => `
        <div class="map-marker" style="left: ${food.mapX}%; top: ${food.mapY}%"
             onclick="viewFoodDetail(${food.id})"
             title="${food.name}">
            <span class="marker-label">${food.name}</span>
        </div>
    `).join('');

    mapContainer.innerHTML = `
        <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
            <div class="text-center text-gray-300">
                <i class="fas fa-map text-4xl mb-2"></i>
                <p class="text-xs">美食地图</p>
            </div>
        </div>
        ${markers}
    `;

    // 渲染美食列表
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state py-8">
                <i class="fas fa-utensils text-2xl"></i>
                <p class="text-sm mt-2">暂无美食收录</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map((food, index) => {
        const stars = '⭐'.repeat(food.rating);
        const categoryMap = {
            local: { label: '本地特色', color: 'bg-orange-100 text-orange-700' },
            snack: { label: '小吃', color: 'bg-yellow-100 text-yellow-700' },
            restaurant: { label: '餐厅', color: 'bg-red-100 text-red-700' }
        };
        const cat = categoryMap[food.category];

        return `
            <div class="food-card animate-slide-in-right" style="animation-delay: ${index * 0.08}s" onclick="viewFoodDetail(${food.id})">
                ${food.image ? `
                    <div class="food-image" style="background-image: url('${food.image}')"></div>
                ` : ''}
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h4 class="text-sm font-bold text-gray-800">${food.name}</h4>
                        <p class="text-xs text-gray-500 mt-0.5">
                            <i class="fas fa-map-marker-alt mr-1 text-sunset"></i>${food.address}
                        </p>
                    </div>
                    <span class="tag ${cat.color}">${cat.label}</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="star-rating">${stars}</div>
                    <span class="text-sm font-semibold text-sunset">¥${food.price}/人</span>
                </div>
                ${food.dishes ? `
                    <div class="mt-2 pt-2 border-t border-gray-100">
                        <p class="text-xs text-gray-500">
                            <i class="fas fa-concierge-bell mr-1 text-sunset"></i>${food.dishes}
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function filterFoods(filter, element) {
    currentFoodFilter = filter;
    document.querySelectorAll('.right-panel .filter-chip').forEach(chip => chip.classList.remove('active'));
    element.classList.add('active');
    renderFoods();
}

function saveFood(event) {
    event.preventDefault();
    const data = {
        id: nextId++,
        name: document.getElementById('foodName').value,
        address: document.getElementById('foodAddress').value,
        rating: parseInt(document.getElementById('foodRating').value),
        category: document.getElementById('foodCategory').value,
        price: parseInt(document.getElementById('foodPrice').value) || 0,
        dishes: document.getElementById('foodDishes').value,
        image: document.getElementById('foodImage').value,
        mapX: Math.floor(Math.random() * 70) + 10,
        mapY: Math.floor(Math.random() * 70) + 10
    };

    foods.unshift(data);
    closeModal('food');
    renderFoods();
    showToast('美食收录已添加！');
}

function viewFoodDetail(id) {
    const food = foods.find(f => f.id === id);
    if (!food) return;

    const stars = '⭐'.repeat(food.rating);
    const categoryMap = {
        local: '本地特色',
        snack: '小吃',
        restaurant: '餐厅'
    };

    document.getElementById('detailModalTitle').textContent = food.name;
    document.getElementById('detailContent').innerHTML = `
        <div class="space-y-4">
            ${food.image ? `
                <div class="rounded-xl overflow-hidden h-48 bg-cover bg-center" style="background-image: url('${food.image}')"></div>
            ` : ''}
            <div class="flex items-center gap-3">
                <span class="tag bg-orange-100 text-orange-700">${categoryMap[food.category]}</span>
                <span class="star-rating">${stars}</span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-gray-500">地址</p>
                    <p class="font-semibold mt-1"><i class="fas fa-map-marker-alt mr-1 text-sunset"></i>${food.address}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-gray-500">人均消费</p>
                    <p class="font-semibold mt-1 text-sunset">¥${food.price}/人</p>
                </div>
            </div>
            ${food.dishes ? `
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">推荐菜品</p>
                    <p class="text-sm text-gray-600"><i class="fas fa-concierge-bell mr-1 text-sunset"></i>${food.dishes}</p>
                </div>
            ` : ''}
            <div class="flex gap-2 mt-4">
                <button onclick="deleteFood(${food.id})" class="btn-danger flex-1">
                    <i class="fas fa-trash-alt mr-1"></i>删除收录
                </button>
            </div>
        </div>
    `;
    openModal('detail');
}

function deleteFood(id) {
    if (confirm('确定要删除这个美食收录吗？')) {
        foods = foods.filter(f => f.id !== id);
        closeModal('detail');
        renderFoods();
        showToast('美食收录已删除');
    }
}

// ==================== 弹窗控制 ====================
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.add('active');
        if (type === 'travel' && !document.getElementById('travelEditId').value) {
            document.getElementById('travelModalTitle').textContent = '添加旅行计划';
            document.getElementById('travelForm').reset();
        }
        if (type === 'checkin') {
            document.getElementById('checkinForm').reset();
        }
        if (type === 'food') {
            document.getElementById('foodForm').reset();
        }
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.remove('active');
    }
    if (type === 'travel') {
        document.getElementById('travelEditId').value = '';
    }
}

// 点击遮罩关闭弹窗
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.getElementById('travelEditId').value = '';
        }
    });
});

// ESC 键关闭弹窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.getElementById('travelEditId').value = '';
    }
});

// ==================== Toast 提示 ====================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium animate-fade-in-up';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
