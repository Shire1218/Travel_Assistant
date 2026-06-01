import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import planRoutes from './routes/plan.routes';
import routeRoutes from './routes/route.routes';
import scheduleRoutes from './routes/schedule.routes';
import spotRoutes from './routes/spot.routes';
import checkinRoutes from './routes/checkin.routes';
import foodRoutes from './routes/food.routes';
import transportRoutes from './routes/transport.routes';
import accommodationRoutes from './routes/accommodation.routes';
import expenseRoutes from './routes/expense.routes';
import todoRoutes from './routes/todo.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 全局中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API路由
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/plans', planRoutes);
app.use('/v1/routes', routeRoutes);
app.use('/v1/schedules', scheduleRoutes);
app.use('/v1/spots', spotRoutes);
app.use('/v1/checkins', checkinRoutes);
app.use('/v1/foods', foodRoutes);
app.use('/v1/transports', transportRoutes);
app.use('/v1/accommodations', accommodationRoutes);
app.use('/v1/expenses', expenseRoutes);
app.use('/v1/todos', todoRoutes);

// 404处理
app.use((_req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// 启动服务器
async function start(): Promise<void> {
  const connected = await testConnection();
  if (!connected) {
    console.error('数据库连接失败，无法启动服务器');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 服务器已启动: http://localhost:${PORT}`);
    console.log(`📋 健康检查: http://localhost:${PORT}/health`);
    console.log(`🔐 认证接口: http://localhost:${PORT}/v1/auth`);
    console.log(`👤 用户接口: http://localhost:${PORT}/v1/users`);
    console.log(`📋 计划接口: http://localhost:${PORT}/v1/plans`);
    console.log(`🗺️ 路线接口: http://localhost:${PORT}/v1/routes`);
    console.log(`📅 日程接口: http://localhost:${PORT}/v1/schedules`);
    console.log(`📍 景点接口: http://localhost:${PORT}/v1/spots`);
    console.log(`✅ 打卡接口: http://localhost:${PORT}/v1/checkins`);
    console.log(`🍜 美食接口: http://localhost:${PORT}/v1/foods`);
    console.log(`🚌 交通接口: http://localhost:${PORT}/v1/transports`);
    console.log(`🏨 住宿接口: http://localhost:${PORT}/v1/accommodations`);
    console.log(`💰 费用接口: http://localhost:${PORT}/v1/expenses`);
    console.log(`📝 待办接口: http://localhost:${PORT}/v1/todos`);
  });
}

start().catch(console.error);

export default app;
