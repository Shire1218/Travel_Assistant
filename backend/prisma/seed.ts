import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始填充种子数据...');

  // 创建测试用户
  const user = await prisma.user.upsert({
    where: { openid: 'test-user-001' },
    update: {},
    create: {
      openid: 'test-user-001',
      nickname: '测试用户',
      gender: 0,
    },
  });
  console.log(`✅ 用户创建: ${user.nickname}`);

  // 创建测试旅行计划
  const plan = await prisma.travelPlan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      title: '大理洱海之旅',
      destination: '云南大理',
      startDate: new Date('2025-08-15'),
      endDate: new Date('2025-08-22'),
      budget: 5000,
      spent: 3200,
      status: 'ongoing',
      description: '环洱海骑行，探访白族村落，感受苍山洱海的壮美。',
      imageUrl: 'https://images.unsplash.com/photo-1571401835390-9a15d78d3410?w=800',
    },
  });
  console.log(`✅ 旅行计划创建: ${plan.title}`);

  // 创建路线景点
  const spots = [
    { name: '洱海生态廊道', displayOrder: 1, distanceKm: 0, durationMin: 0 },
    { name: '双廊古镇', displayOrder: 2, distanceKm: 35, durationMin: 45 },
    { name: '崇圣寺三塔', displayOrder: 3, distanceKm: 20, durationMin: 30 },
    { name: '喜洲古镇', displayOrder: 4, distanceKm: 18, durationMin: 25 },
  ];
  for (const spot of spots) {
    await prisma.routeSpot.create({
      data: { planId: plan.id, ...spot },
    });
  }
  console.log('✅ 路线景点创建完成');

  // 创建日程安排
  const schedules = [
    { date: new Date('2025-08-15'), startTime: '09:00', endTime: '12:00', title: '抵达大理，入住酒店', description: '从昆明乘坐高铁抵达大理', type: 'transport' },
    { date: new Date('2025-08-15'), startTime: '14:00', endTime: '17:00', title: '游览古城', description: '漫步大理古城，感受白族文化', type: 'sightseeing' },
    { date: new Date('2025-08-16'), startTime: '08:00', endTime: '12:00', title: '环洱海骑行', description: '从才村码头出发，沿生态廊道骑行', type: 'activity' },
  ];
  for (const item of schedules) {
    await prisma.scheduleItem.create({
      data: { planId: plan.id, ...item },
    });
  }
  console.log('✅ 日程安排创建完成');

  // 创建景点详情
  const spotDetails = [
    { name: '洱海', description: '云南第二大淡水湖，被誉为"高原明珠"。环湖一周约120公里，沿途风光旖旎。', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', openHours: '全天开放', ticketPrice: '免费', contact: '0872-2672987' },
    { name: '崇圣寺三塔', description: '大理标志性建筑，始建于唐代，已有1000多年历史。', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3cb2d78dec?w=800', openHours: '08:00-18:00', ticketPrice: '¥75', contact: '0872-2670497' },
  ];
  for (const detail of spotDetails) {
    await prisma.spotDetail.create({
      data: { planId: plan.id, ...detail },
    });
  }
  console.log('✅ 景点详情创建完成');

  // 创建打卡记录
  const checkins = [
    { location: '洱海生态廊道', date: new Date('2025-08-16'), description: '清晨的洱海美得像一幅画，阳光洒在湖面上波光粼粼。', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { location: '双廊古镇', date: new Date('2025-08-17'), description: '双廊的小巷子里藏着许多有趣的小店。', imageUrl: '' },
  ];
  for (const checkin of checkins) {
    await prisma.checkin.create({
      data: { planId: plan.id, ...checkin },
    });
  }
  console.log('✅ 打卡记录创建完成');

  // 创建美食收录
  const foods = [
    { name: '段氏酸菜鱼', address: '大理古城人民路下段', rating: 5, category: 'local', pricePerPerson: 85, dishes: '酸菜鱼、乳扇、饵块', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', mapX: 25, mapY: 35 },
    { name: '喜洲粑粑铺', address: '喜洲古镇中心', rating: 4, category: 'snack', pricePerPerson: 15, dishes: '喜洲粑粑（甜/咸）', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', mapX: 55, mapY: 50 },
  ];
  for (const food of foods) {
    await prisma.food.create({
      data: { planId: plan.id, ...food },
    });
  }
  console.log('✅ 美食收录创建完成');

  // 创建交通记录
  const transports = [
    { type: '高铁', from: '昆明', to: '大理', time: '2025-08-15 08:30', cost: 145, note: 'D字头动车，约2小时' },
    { type: '租车', from: '大理古城', to: '环洱海', time: '2025-08-16', cost: 200, note: '电动车环湖，租2天' },
  ];
  for (const t of transports) {
    await prisma.transport.create({
      data: { planId: plan.id, ...t },
    });
  }
  console.log('✅ 交通记录创建完成');

  // 创建住宿记录
  await prisma.accommodation.create({
    data: {
      planId: plan.id,
      name: '大理洱海海景酒店',
      address: '大理市洱海边',
      checkIn: '2025-08-15',
      checkOut: '2025-08-22',
      price: 380,
      note: '海景房，含早餐',
    },
  });
  console.log('✅ 住宿记录创建完成');

  // 创建费用记录
  const expenses = [
    { category: '交通', amount: 345, date: '2025-08-15', note: '高铁+租车' },
    { category: '住宿', amount: 2660, date: '2025-08-15', note: '7晚海景房' },
    { category: '餐饮', amount: 195, date: '2025-08-16', note: '3餐' },
  ];
  for (const expense of expenses) {
    await prisma.expense.create({
      data: { planId: plan.id, ...expense },
    });
  }
  console.log('✅ 费用记录创建完成');

  // 创建待办事项
  const todos = [
    { text: '预订返程车票', completed: false },
    { text: '购买防晒霜和墨镜', completed: true },
    { text: '准备骑行装备', completed: false },
  ];
  for (const todo of todos) {
    await prisma.todo.create({
      data: { planId: plan.id, ...todo },
    });
  }
  console.log('✅ 待办事项创建完成');

  console.log('\n🎉 种子数据填充完成！');
}

main()
  .catch((e) => {
    console.error('种子数据填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
