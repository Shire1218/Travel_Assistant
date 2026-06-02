# 智能旅游助手系统 - 完整开发计划

> 项目：Travel Assistant 智能旅游助手
> 版本：v 2.0（个人开发者优化版）
> 编制日期：2026年6月1日
> 最后更新：2026年6月1日
> 项目周期：20周（约5个月）
> 开发模式：个人全栈开发

---

## 目录

1. [需求分析与规划阶段](#1-需求分析与规划阶段)
2. [个人开发者技术选型](#2-个人开发者技术选型)
3. [Web端前端开发实施（第一阶段）](#3-web端前端开发实施第一阶段)
4. [后端架构设计与开发](#4-后端架构设计与开发)
5. [数据库设计与实现](#5-数据库设计与实现)
6. [LLM智能服务集成](#6-llm智能服务集成)
7. [前后端集成与测试](#7-前后端集成与测试)
8. [部署与运维规划](#8-部署与运维规划)
9. [项目管理与时间规划](#9-项目管理与时间规划)
10. [文档与交付物](#10-文档与交付物)

---

## 1. 需求分析与规划阶段

### 1.1 系统定位

智能旅游助手是一款面向个人旅行者的综合性旅行管理平台，提供从行程规划、景点推荐、打卡记录到美食收录的一站式服务。系统以 **Web端为首发平台**，微信小程序为第二阶段扩展，实现多端协同。

**LLM集成方向**：接入大语言模型，实现智能行程规划、景点推荐、旅行问答、行程优化等AI驱动功能。

### 1.2 核心功能需求

| 优先级 | 功能模块 | 功能描述 | 优先级 | LLM增强 |
|--------|---------|---------|--------|---------|
| P0 | 用户系统 | 注册、登录、个人信息管理、头像上传 | 最高 | - |
| P0 | 旅行计划管理 | 创建、编辑、删除旅行计划，状态管理 | 最高 | - |
| P0 | 路线规划 | 景点添加/删除/排序、距离时间估算 | 最高 | AI智能排序 |
| P0 | 时间安排 | 日程管理、时间冲突检测、日/周视图 | 最高 | AI日程优化 |
| P1 | 打卡记录 | 地点打卡、图片上传、时间轴展示 | 高 | AI游记生成 |
| P1 | 美食收录 | 店铺信息记录、评分、地图标记 | 高 | AI美食推荐 |
| P1 | 预算管理 | 费用记录、预算概览、分类统计 | 高 | - |
| P1 | 交通住宿 | 交通方式记录、住宿信息管理 | 高 | - |
| P2 | AI行程规划 | 基于目的地/天数/预算自动生成行程 | 高 | ⭐核心LLM功能 |
| P2 | 景点推荐 | 基于目的地和偏好的智能推荐 | 中 | LLM语义推荐 |
| P2 | 旅行问答 | 自然语言问答，如"大理有什么好吃的" | 中 | ⭐LLM对话 |
| P2 | 天气查询 | 目的地天气实时查询和预报 | 中 | - |
| P2 | 笔记待办 | 旅行笔记、待办事项清单 | 中 | AI笔记整理 |
| P2 | 地图服务 | 美食/景点地图展示、路线导航 | 中 | - |
| P3 | 社交分享 | 旅行动态分享、好友互动 | 低 | - |
| P3 | 酒店预订 | 酒店搜索、比价、预订 | 低 | - |
| P3 | 支付集成 | 在线支付、订单管理 | 低 | - |

### 1.3 用户角色与权限

| 角色 | 权限范围 | 说明 |
|------|---------|------|
| 普通用户 | 管理自己的旅行计划、打卡记录、美食收录 | 注册即可使用 |
| 认证用户 | 普通用户权限 + AI行程规划、天气查询、旅行问答 | 完成微信授权 |
| 管理员 | 用户管理、内容审核、数据统计、系统配置 | 后台管理（后期） |

### 1.4 功能优先级实施顺序

```
Phase 1 (Web端 MVP) ──────────────────→ Phase 2 (Web端增强) ──────────────────→ Phase 3 (小程序)
┌─────────────────────────────┐    ┌─────────────────────────────┐    ┌─────────────────────────────┐
│ 1. 用户系统                  │    │ 1. AI行程规划 (LLM)         │    │ 1. 小程序登录               │
│ 2. 旅行计划 CRUD             │    │ 2. 旅行问答 (LLM)           │    │ 2. 计划列表                 │
│ 3. 路线规划                  │    │ 3. 景点推荐 (LLM)           │    │ 3. 路线规划                 │
│ 4. 时间安排                  │    │ 4. AI游记生成 (LLM)         │    │ 4. 打卡记录                 │
│ 5. 景点介绍                  │    │ 5. 地图服务                 │    │ 5. 美食收录                 │
│ 6. 打卡记录                  │    │ 6. 天气查询                 │    │ 6. 地图                     │
│ 7. 美食收录                  │    │ 7. 预算管理                 │    │ 7. 个人中心                 │
│ 8. 交通/住宿/预算/待办       │    │ 8. 交通/住宿/预算/待办      │    │ 8. AI功能                   │
│ 9. 基础地图展示              │    │ 9. 社交分享                 │    │                             │
└─────────────────────────────┘    └─────────────────────────────┘    └─────────────────────────────┘
        第1-8周                              第9-14周                          第15-20周
```

---

## 2. 个人开发者技术选型

### 2.1 最终推荐技术栈

```
┌─────────────────────────────────────────────────────────────────┐
│                    个人开发者最佳技术栈                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  前端（Web）：HTML5 + Tailwind CSS + Vanilla JS                 │
│  前端（小程序）：微信小程序原生框架（第二阶段）                    │
│  后端：Node.js 18 LTS + Express.js + TypeScript                 │
│  ORM：Prisma 5（支持 SQLite → PostgreSQL 平滑迁移）             │
│  数据库（MVP）：SQLite（零配置，单文件）                          │
│  数据库（生产）：PostgreSQL 15（Supabase/Neon 免费托管）         │
│  缓存：Redis（后期按需添加）                                     │
│  认证：JWT + bcryptjs                                           │
│  LLM：OpenAI API / 阿里云通义千问 / 智谱AI（多提供商适配）       │
│  文件存储：Supabase Storage（免费 1GB）                          │
│  地图服务：腾讯地图 API（小程序兼容最佳）                         │
│  天气服务：和风天气 API（免费额度 1000次/天）                     │
│  部署（前端）：Vercel（免费，Git Push 部署）                     │
│  部署（后端）：Railway（免费 $5/月）或 Render（免费层）           │
│  部署（数据库）：Supabase（免费 500MB）或 Neon（免费 0.5GB）     │
│                                                                 │
│  💰 总成本：$0/月（免费额度内可支撑 1000 日活）                  │
│  📚 学习成本：低（全栈 JavaScript/TypeScript）                   │
│  ⚡ 开发效率：高（生态丰富，npm 200万+ 包）                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 技术选型详细对比

#### 后端语言对比

| 维度 | Node.js + Express | Python + FastAPI | Go + Gin | Java + Spring Boot |
|------|-------------------|------------------|----------|-------------------|
| 学习曲线 | ⭐⭐⭐⭐ 低 | ⭐⭐⭐⭐⭐ 最低 | ⭐⭐⭐ 中 | ⭐⭐ 高 |
| 开发效率 | ⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐⭐ 最高 | ⭐⭐⭐ 中 | ⭐⭐ 低 |
| 与前端统一 | ⭐⭐⭐⭐⭐ 同一语言 | ⭐⭐ 需学新语言 | ⭐⭐ 需学新语言 | ⭐ 需学新语言 |
| 部署便利 | ⭐⭐⭐⭐ 好 | ⭐⭐⭐⭐ 好 | ⭐⭐⭐⭐⭐ 最好 | ⭐⭐ 较差 |
| 免费资源 | ⭐⭐⭐⭐ 丰富 | ⭐⭐⭐⭐⭐ 最丰富 | ⭐⭐⭐ 一般 | ⭐⭐ 较少 |
| LLM集成 | ⭐⭐⭐⭐ 好 | ⭐⭐⭐⭐⭐ 最佳 | ⭐⭐⭐ 一般 | ⭐⭐ 一般 |
| 小程序适配 | ⭐⭐⭐⭐⭐ 最佳 | ⭐⭐⭐⭐ 好 | ⭐⭐⭐ 一般 | ⭐⭐ 一般 |
| 维护成本 | ⭐⭐⭐⭐ 低 | ⭐⭐⭐⭐⭐ 最低 | ⭐⭐⭐⭐ 低 | ⭐⭐ 高 |

**选择 Node.js 的理由**：
1. **全栈统一**：前后端使用同一语言，代码可共享（类型定义、工具函数）
2. **生态最丰富**：npm 包数量全球第一，每个问题都有现成解决方案
3. **部署最便利**：Vercel/Railway 支持 Node.js 一键部署
4. **LLM SDK 成熟**：OpenAI、LangChain.js 等 SDK 完善
5. **小程序天然契合**：JSON 数据格式、异步模型完全一致

#### 数据库对比

| 维度 | SQLite (MVP) | PostgreSQL (生产) | MySQL | MongoDB |
|------|-------------|-------------------|-------|---------|
| 零配置启动 | ⭐⭐⭐⭐⭐ | ⭐⭐ 需云托管 | ⭐⭐ 需云托管 | ⭐⭐ 需云托管 |
| 学习难度 | ⭐⭐⭐⭐⭐ 最低 | ⭐⭐⭐ 中 | ⭐⭐⭐ 中 | ⭐⭐⭐⭐ 低 |
| JSON支持 | ⭐⭐⭐ 好 | ⭐⭐⭐⭐⭐ 最佳 | ⭐⭐⭐⭐ 好 | ⭐⭐⭐⭐⭐ 原生 |
| 全文搜索 | ⭐⭐⭐ 好 | ⭐⭐⭐⭐⭐ 最佳 | ⭐⭐⭐ 中 | ⭐⭐⭐ 中 |
| 免费托管 | ⭐⭐⭐⭐⭐ 本地文件 | ⭐⭐⭐⭐⭐ Supabase | ⭐⭐⭐ 较少 | ⭐⭐⭐⭐ MongoDB Atlas |
| 迁移成本 | - | ⭐⭐⭐⭐⭐ Prisma一键迁移 | ⭐⭐ 需转换 | ⭐⭐ 需转换 |
| 空间数据 | ⭐⭐ 一般 | ⭐⭐⭐⭐⭐ PostGIS | ⭐⭐⭐ 一般 | ⭐⭐⭐⭐ 原生 |

**选择 SQLite → PostgreSQL 的理由**：
1. **MVP 阶段零成本**：SQLite 单文件数据库，无需任何服务器
2. **Prisma 平滑迁移**：改一行配置即可从 SQLite 迁移到 PostgreSQL
3. **PostgreSQL 功能最强**：JSON、全文搜索、空间数据（地图）全面支持
4. **免费托管丰富**：Supabase、Neon 提供免费 PostgreSQL

### 2.3 LLM 服务选型

| 提供商 | 免费额度 | 优势 | 适用场景 |
|--------|---------|------|---------|
| OpenAI (GPT-4o-mini) | $5 额度 | 质量最佳，生态最成熟 | 行程规划、智能问答 |
| 阿里云通义千问 | 免费 100万 tokens/月 | 中文理解好，国内访问快 | 中文旅行问答 |
| 智谱AI (ChatGLM) | 免费 100万 tokens/月 | 中文优化，API 简单 | 中文内容生成 |
| 月之暗面 (Kimi) | 免费额度 | 长上下文支持 | 长游记分析 |

**推荐策略**：
- MVP 阶段：使用 **阿里云通义千问**（中文好 + 免费额度 + 国内访问快）
- 生产阶段：多提供商适配，支持 OpenAI + 通义千问 切换
- 成本优化：小任务用 GPT-4o-mini / 通义千问标准版，复杂任务用 GPT-4 / 通义千问-plus

---

## 3. Web端前端开发实施（第一阶段）

### 3.1 当前进度

```
✅ 已完成：
├── frontDesign/          # UI设计稿（3个文件原型）
│   ├── index.html        # 完整页面结构
│   ├── styles.css        # 所有CSS样式
│   └── app.js            # 所有业务逻辑
└── front/                # 响应式Web前端
    ├── index.html        # 主页面 + 编辑页面
    ├── styles.css        # 完整样式（含新布局）
    └── app.js            # 完整业务逻辑（750行）

📊 已完成功能：
├── ✅ 旅行计划列表（卡片展示、统计面板）
├── ✅ 旅行计划CRUD（创建、编辑、删除）
├── ✅ 路线规划（添加/删除/拖拽排序/路线预览）
├── ✅ 时间安排（日程列表、日期导航、冲突检测）
├── ✅ 景点介绍（卡片式布局、点击编辑弹窗）
├── ✅ 打卡记录（时间轴、筛选、详情查看）
├── ✅ 美食收录（卡片列表、分类筛选、详情查看）
├── ✅ 地图展示（Mock数据、标记点、图例）
├── ✅ 交通/住宿/预算/待办/笔记
├── ✅ 左右分栏可拖动调整
├── ✅ 响应式布局（桌面7:3，移动端上下）
└── ✅ 自动保存、Toast提示、弹窗系统
```

### 3.2 Web端目录结构

```
front/                    # Web前端（响应式）
├── index.html            # 主页面入口
├── styles.css            # 所有CSS样式
├── app.js                # 业务逻辑
├── api/                  # API请求封装（待开发）
│   ├── request.js        # 统一请求封装
│   ├── auth.js           # 认证API
│   ├── plan.js           # 计划API
│   ├── route.js          # 路线API
│   ├── schedule.js       # 日程API
│   ├── spot.js           # 景点API
│   ├── checkin.js        # 打卡API
│   ├── food.js           # 美食API
│   ├── llm.js            # LLM API
│   └── upload.js         # 上传API
├── utils/                # 工具函数（待开发）
│   ├── storage.js        # localStorage封装
│   ├── date.js           # 日期工具
│   ├── validate.js       # 表单验证
│   └── toast.js          # Toast组件
└── assets/               # 静态资源（待开发）
    └── images/
```

### 3.3 Web端开发任务分解

#### 阶段一：现有原型优化（第1-2周）✅ 大部分已完成

| 任务 | 状态 | 描述 | 交付物 |
|------|------|------|--------|
| 页面结构优化 | ✅ | 主页面 + 编辑页面双视图切换 | index.html |
| 响应式布局 | ✅ | 桌面7:3分栏，移动端上下布局 | styles.css |
| 路线规划 | ✅ | 拖拽排序、上下移动、路线预览 | app.js |
| 时间安排 | ✅ | 日期导航、冲突检测、活动CRUD | app.js |
| 景点卡片 | ✅ | 卡片式布局、点击编辑弹窗 | app.js |
| 侧边栏整合 | ✅ | 打卡/美食/地图三Tab | index.html |
| 可拖动分隔线 | ✅ | 鼠标拖拽调整左右宽度 | app.js |
| 自动保存 | ✅ | 操作后1秒自动保存提示 | app.js |
| 旅行计划列表 | ✅ | 卡片展示、统计面板、CRUD | app.js |

#### 阶段二：前后端对接（第3-5周）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| API请求封装 | 封装fetch，统一错误处理、Token管理、重试机制 | api/request.js |
| 数据持久化 | localStorage → API 过渡，离线缓存策略 | utils/storage.js |
| 认证流程 | 登录/注册页面、Token存储、自动刷新 | api/auth.js |
| 图片上传 | 对接Supabase Storage，图片预览、压缩 | api/upload.js |
| 状态管理 | 全局状态管理（用户信息、当前计划、加载状态） | store/index.js |
| 错误边界 | 全局错误捕获、用户友好的错误提示 | utils/error.js |

#### 阶段三：LLM功能集成（第6-8周）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| AI行程规划 | 输入目的地/天数/预算，LLM生成完整行程 | pages/ai-plan/ |
| 旅行问答 | 自然语言问答界面，流式输出 | components/chat/ |
| AI游记生成 | 基于打卡记录自动生成游记 | utils/ai-journal.js |
| 智能推荐 | 基于历史数据推荐景点/美食 | utils/ai-recommend.js |
| 行程优化 | LLM分析并优化现有行程 | utils/ai-optimize.js |

#### 阶段四：体验优化（第9-10周）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| 加载状态 | 骨架屏、加载动画、过渡效果 | 全局加载组件 |
| 离线支持 | Service Worker、离线缓存、同步机制 | sw.js |
| PWA支持 | manifest.json、安装提示 | PWA配置 |
| 性能优化 | 图片懒加载、代码分割、缓存策略 | 性能报告 |
| 无障碍 | ARIA标签、键盘导航、屏幕阅读器 | 无障碍测试报告 |

---

## 4. 后端架构设计与开发

### 4.1 目录结构

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # 数据库配置（SQLite/PostgreSQL切换）
│   │   ├── llm.ts            # LLM提供商配置
│   │   └── cloud.ts          # 云存储配置
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── plan.controller.ts
│   │   ├── route.controller.ts
│   │   ├── schedule.controller.ts
│   │   ├── spot.controller.ts
│   │   ├── checkin.controller.ts
│   │   ├── food.controller.ts
│   │   ├── llm.controller.ts         # LLM相关接口
│   │   └── upload.controller.ts
│   ├── services/
│   │   ├── llm.service.ts            # LLM服务（多提供商适配）
│   │   ├── recommend.service.ts      # 推荐服务
│   │   ├── weather.service.ts        # 天气服务
│   │   ├── itinerary.service.ts      # 行程规划服务（LLM）
│   │   └── journal.service.ts        # 游记生成服务（LLM）
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts   # 限流（LLM API保护）
│   ├── routes/
│   │   └── ...
│   ├── utils/
│   │   ├── response.ts       # 统一响应格式
│   │   └── logger.ts         # 日志
│   └── app.ts
├── prisma/
│   ├── schema.prisma         # 数据模型（SQLite/PostgreSQL通用）
│   └── seed.ts               # 种子数据
├── tests/
│   ├── unit/
│   └── integration/
├── .env                      # 环境变量
├── package.json
├── tsconfig.json
└── Dockerfile
```

### 4.2 后端开发任务分解

#### 阶段一：基础架构（第3-4周）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| 项目初始化 | npm init、TypeScript配置、ESLint、Prettier | 可运行的空项目 |
| Prisma初始化 | schema定义、SQLite连接、数据迁移 | prisma/schema.prisma |
| 认证系统 | JWT生成/验证、bcrypt密码加密、微信登录 | auth.controller.ts |
| 中间件 | 错误处理、请求验证、权限校验、限流 | middleware/ |
| 统一响应 | 标准化JSON响应格式 | utils/response.ts |

#### 阶段二：核心业务（第5-7周）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| 用户模块 | CRUD、头像上传 | user.controller.ts |
| 计划模块 | CRUD、状态管理、统计 | plan.controller.ts |
| 路线模块 | CRUD、排序、距离估算 | route.controller.ts |
| 日程模块 | CRUD、冲突检测 | schedule.controller.ts |
| 景点模块 | CRUD | spot.controller.ts |
| 打卡模块 | CRUD、图片上传 | checkin.controller.ts |
| 美食模块 | CRUD、分类筛选 | food.controller.ts |
| 其他模块 | 交通、住宿、费用、待办 | 对应controller |

#### 阶段三：LLM集成（第8-10周）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| LLM服务层 | 多提供商适配（通义千问/OpenAI）、流式输出 | services/llm.service.ts |
| AI行程规划 | 目的地+天数+预算 → 完整行程 | services/itinerary.service.ts |
| 旅行问答 | 自然语言问答、上下文管理 | services/qa.service.ts |
| AI游记生成 | 打卡记录 → 游记文章 | services/journal.service.ts |
| 智能推荐 | 基于用户偏好推荐 | services/recommend.service.ts |
| 限流保护 | LLM API调用限流、缓存 | middleware/rateLimit.middleware.ts |

---

## 5. 数据库设计与实现

### 5.1 MVP阶段：SQLite

```prisma
// prisma/schema.prisma (MVP阶段 - SQLite)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id         Int       @id @default(autoincrement())
  openid     String    @unique @db.VarChar(64)
  nickname   String?   @db.VarChar(100)
  avatarUrl  String?   @db.VarChar(500)
  phone      String?   @unique @db.VarChar(20)
  gender     Int       @default(0)
  plans      TravelPlan[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model TravelPlan {
  id          Int       @id @default(autoincrement())
  userId      Int
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String    @db.VarChar(200)
  destination String    @db.VarChar(200)
  startDate   DateTime
  endDate     DateTime
  budget      Decimal   @default(0) @db.Decimal(10, 2)
  spent       Decimal   @default(0) @db.Decimal(10, 2)
  status      String    @default("planned") // planned, ongoing, completed
  description String?   @db.Text
  imageUrl    String?   @db.VarChar(500)
  notes       String?   @db.Text
  routeSpots  RouteSpot[]
  scheduleItems ScheduleItem[]
  spotDetails SpotDetail[]
  checkins    Checkin[]
  foods       Food[]
  transports  Transport[]
  accommodations Accommodation[]
  expenses    Expense[]
  todos       Todo[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId, status])
}

model RouteSpot {
  id           Int      @id @default(autoincrement())
  planId       Int
  plan         TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  name         String   @db.VarChar(200)
  displayOrder Int
  distanceKm   Decimal  @default(0) @db.Decimal(8, 2)
  durationMin  Int      @default(0)
  createdAt    DateTime @default(now())
}

model ScheduleItem {
  id          Int      @id @default(autoincrement())
  planId      Int
  plan        TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  date        DateTime
  startTime   String   @db.VarChar(10)
  endTime     String   @db.VarChar(10)
  title       String   @db.VarChar(200)
  description String?  @db.Text
  type        String   @default("other")
  createdAt   DateTime @default(now())

  @@index([planId, date])
}

model SpotDetail {
  id          Int      @id @default(autoincrement())
  planId      Int
  plan        TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  name        String   @db.VarChar(200)
  description String?  @db.Text
  imageUrl    String?  @db.VarChar(500)
  openHours   String?  @db.VarChar(100)
  ticketPrice String?  @db.VarChar(50)
  contact     String?  @db.VarChar(50)
  createdAt   DateTime @default(now())
}

model Checkin {
  id          Int      @id @default(autoincrement())
  planId      Int
  plan        TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  location    String   @db.VarChar(200)
  date        DateTime
  description String?  @db.Text
  imageUrl    String?  @db.VarChar(500)
  createdAt   DateTime @default(now())

  @@index([planId, date])
}

model Food {
  id             Int      @id @default(autoincrement())
  planId         Int
  plan           TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  name           String   @db.VarChar(200)
  address        String   @db.VarChar(300)
  rating         Int                  // 1-5
  category       String?  @db.VarChar(50)
  pricePerPerson Decimal? @db.Decimal(8, 2)
  dishes         String?  @db.VarChar(500)
  imageUrl       String?  @db.VarChar(500)
  mapX           Decimal? @db.Decimal(5, 2)
  mapY           Decimal? @db.Decimal(5, 2)
  createdAt      DateTime @default(now())

  @@index([planId, category])
}

model Transport {
  id        Int      @id @default(autoincrement())
  planId    Int
  plan      TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  type      String   @db.VarChar(50)
  from      String   @db.VarChar(200)
  to        String   @db.VarChar(200)
  time      String   @db.VarChar(50)
  cost      Decimal  @default(0) @db.Decimal(8, 2)
  note      String?  @db.Text
  createdAt DateTime @default(now())
}

model Accommodation {
  id        Int      @id @default(autoincrement())
  planId    Int
  plan      TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  name      String   @db.VarChar(200)
  address   String   @db.VarChar(300)
  checkIn   String   @db.VarChar(20)
  checkOut  String   @db.VarChar(20)
  price     Decimal  @default(0) @db.Decimal(8, 2)
  note      String?  @db.Text
  createdAt DateTime @default(now())
}

model Expense {
  id        Int      @id @default(autoincrement())
  planId    Int
  plan      TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  category  String   @db.VarChar(50)
  amount    Decimal  @db.Decimal(8, 2)
  date      String   @db.VarChar(20)
  note      String?  @db.Text
  createdAt DateTime @default(now())
}

model Todo {
  id        Int      @id @default(autoincrement())
  planId    Int
  plan      TravelPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  text      String   @db.VarChar(500)
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### 5.2 生产阶段迁移到 PostgreSQL

```prisma
// 只需修改 datasource 配置，模型完全不变
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // Supabase/Neon 连接字符串
}
```

迁移命令：
```bash
# 1. 修改 provider
# 2. 设置 DATABASE_URL 环境变量
# 3. 执行迁移
npx prisma db push
npx prisma migrate dev --name migrate-to-postgres
```

---

## 6. LLM智能服务集成

### 6.1 LLM服务架构

```
┌─────────────────────────────────────────────────────┐
│                    前端 (Web/小程序)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │AI行程规划 │  │旅行问答  │  │AI游记生成│          │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘          │
│        │              │              │               │
└────────┼──────────────┼──────────────┼───────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────────────────────────────────────────────┐
│                  后端 API 层                         │
│  ┌─────────────────────────────────────────────┐   │
│  │           llm.controller.ts                 │   │
│  │  - POST /llm/itinerary  (行程规划)          │   │
│  │  - POST /llm/chat       (旅行问答)          │   │
│  │  - POST /llm/journal    (游记生成)          │   │
│  │  - POST /llm/recommend  (智能推荐)          │   │
│  │  - POST /llm/optimize   (行程优化)          │   │
│  └────────────────┬────────────────────────────┘   │
└───────────────────┼────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│                  LLM 服务层                          │
│  ┌─────────────────────────────────────────────┐   │
│  │           llm.service.ts                    │   │
│  │  ┌─────────────┐  ┌─────────────┐          │   │
│  │  │ Provider接口 │  │ 缓存层      │          │   │
│  │  │ (多提供商)   │  │ (Redis)     │          │   │
│  │  └──────┬──────┘  └─────────────┘          │   │
│  │         │                                   │   │
│  │  ┌──────▼──────┐  ┌─────────────┐          │   │
│  │  │通义千问SDK   │  │OpenAI SDK   │          │   │
│  │  │(默认)       │  │(备选)       │          │   │
│  │  └─────────────┘  └─────────────┘          │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 6.2 LLM API设计

```typescript
// POST /llm/itinerary - AI行程规划
interface ItineraryRequest {
  destination: string;      // 目的地
  days: number;             // 天数
  budget: number;           // 预算
  preferences: string[];    // 偏好：["美食", "自然风光", "历史文化"]
  travelStyle: string;      // 旅行风格：relaxed / balanced / intensive
}

interface ItineraryResponse {
  plan: {
    title: string;
    dailyItinerary: {
      day: number;
      date: string;
      activities: {
        time: string;
        title: string;
        location: string;
        description: string;
        estimatedCost: number;
      }[];
    }[];
    totalBudget: number;
  };
}

// POST /llm/chat - 旅行问答（流式）
interface ChatRequest {
  message: string;          // 用户问题
  context?: {               // 上下文
    destination?: string;
    planId?: number;
    history?: { role: string; content: string }[];
  };
}

// POST /llm/journal - AI游记生成
interface JournalRequest {
  planId: number;           // 旅行计划ID
  style?: string;           // 风格：literary / casual / humorous
  length?: string;          // 长度：short / medium / long
}
```

### 6.3 LLM服务实现要点

```typescript
// services/llm.service.ts
class LLMService {
  private providers: Map<string, LLMProvider>;
  private cache: RedisCache;

  // 多提供商适配
  async generate(prompt: string, options?: GenerateOptions): Promise<string> {
    // 1. 检查缓存
    const cached = await this.cache.get(prompt);
    if (cached) return cached;

    // 2. 选择提供商（默认通义千问，失败时降级到OpenAI）
    const provider = this.selectProvider();

    // 3. 调用LLM
    const result = await provider.generate(prompt, options);

    // 4. 缓存结果
    await this.cache.set(prompt, result, TTL);

    return result;
  }

  // 流式输出（用于聊天）
  async *streamChat(messages: Message[]): AsyncGenerator<string> {
    const provider = this.selectProvider();
    yield* provider.streamChat(messages);
  }
}
```

### 6.4 LLM Prompt设计示例

```typescript
// 行程规划 Prompt
const itineraryPrompt = `
你是一个专业的旅行规划师。请根据以下信息为用户规划一份详细的旅行行程：

目的地：{destination}
旅行天数：{days}天
预算：{budget}元
偏好：{preferences}
旅行风格：{travelStyle}

请按照以下JSON格式返回：
{
  "title": "旅行标题",
  "dailyItinerary": [
    {
      "day": 1,
      "date": "日期",
      "activities": [
        {
          "time": "时间段",
          "title": "活动名称",
          "location": "地点",
          "description": "详细描述",
          "estimatedCost": 预估费用
        }
      ]
    }
  ],
  "totalBudget": 总预算,
  "tips": ["旅行小贴士"]
}

要求：
1. 行程合理，考虑景点之间的距离和交通时间
2. 每天安排适中，不要过于紧凑
3. 包含当地特色美食推荐
4. 预算控制在用户预算范围内
5. 符合用户的偏好和旅行风格
`;
```

---

## 7. 前后端集成与测试

### 7.1 开发环境配置

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | http://localhost:3000 | Vite开发服务器 |
| 后端 | http://localhost:8080 | Express开发服务器 |
| 数据库 | file:./dev.db | SQLite本地文件 |
| LLM | 阿里云通义千问 | 开发环境使用测试Key |

### 7.2 接口联调计划

| 轮次 | 内容 | 验证标准 |
|------|------|---------|
| 1 | 认证接口 | 登录/注册/Token刷新正常 |
| 2 | 计划CRUD | 增删改查完整流程 |
| 3 | 路线/日程 | 排序、冲突检测正常 |
| 4 | 打卡/美食 | 图片上传、列表展示 |
| 5 | LLM接口 | 行程规划、问答正常 |
| 6 | 完整流程 | 端到端核心流程 |

### 7.3 测试策略

| 测试类型 | 工具 | 覆盖率目标 | 说明 |
|---------|------|-----------|------|
| 单元测试 | Jest | > 70% | 后端业务逻辑 + LLM服务 |
| 接口测试 | Supertest | 100% API | 所有API端点 |
| E2E测试 | Playwright | 核心流程 | 端到端流程 |
| LLM测试 | 自定义 | 关键场景 | Prompt效果验证 |

---

## 8. 部署与运维规划

### 8.1 免费部署方案

```
┌─────────────────────────────────────────────────┐
│              免费部署架构 ($0/月)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  前端：Vercel                                   │
│    - 自动HTTPS                                  │
│    - 全球CDN                                    │
│    - Git Push部署                               │
│    - 免费额度：100GB带宽/月                     │
│                                                 │
│  后端：Railway                                  │
│    - Node.js自动部署                            │
│    - 自动HTTPS                                  │
│    - 免费额度：$5/月 (约500万请求)              │
│                                                 │
│  数据库：Supabase                               │
│    - PostgreSQL 500MB                           │
│    - 自动备份                                   │
│    - 免费额度：足够1000日活                     │
│                                                 │
│  文件存储：Supabase Storage                     │
│    - 1GB存储空间                                │
│    - CDN加速                                    │
│    - 免费额度：足够个人项目                     │
│                                                 │
│  LLM：阿里云通义千问                            │
│    - 免费100万tokens/月                         │
│    - 约支持500次行程规划                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 8.2 部署流程

```bash
# 前端部署到 Vercel
git push origin main          # 推送到GitHub
# Vercel自动检测并部署

# 后端部署到 Railway
railway login                 # 登录Railway CLI
railway init                  # 初始化项目
railway up                    # 部署

# 数据库初始化
npx prisma db push            # 同步schema到Supabase
npx prisma db seed            # 填充种子数据
```

### 8.3 监控方案

| 监控项 | 工具 | 免费方案 |
|--------|------|---------|
| 错误监控 | Sentry | 免费 5000 events/月 |
| 日志 | Railway内置 | 免费 |
| 数据库监控 | Supabase Dashboard | 免费 |
| 前端性能 | Vercel Analytics | 免费 |
| LLM调用监控 | 自定义日志 | 免费 |

---

## 9. 项目管理与时间规划

### 9.1 里程碑规划

| 里程碑 | 时间 | 交付内容 | 状态 |
|--------|------|---------|------|
| M1: 原型验证 | 第1-2周 | Web原型完成，核心交互验证 | ✅ 已完成 |
| M2: MVP后端 | 第3-5周 | 后端API + SQLite + 前后端对接 | 待开始 |
| M3: LLM集成 | 第6-8周 | AI行程规划 + 旅行问答 | 待开始 |
| M4: Web完整版 | 第9-10周 | 所有功能完成 + 体验优化 | 待开始 |
| M5: 生产部署 | 第11-12周 | PostgreSQL迁移 + 部署上线 | 待开始 |
| M6: 小程序端 | 第13-17周 | 小程序版本开发 | 待开始 |
| M7: 上线发布 | 第18-20周 | 测试 + 文档 + 发布 | 待开始 |

### 9.2 迭代计划（个人开发者节奏）

| Sprint | 周期 | 目标 | 主要功能 | 每周投入 |
|--------|------|------|---------|---------|
| S1 | 第1-2周 | 原型优化 | 现有前端优化、API封装准备 | 10小时 |
| S2 | 第3-4周 | 后端基础 | Node.js后端、Prisma、认证 | 10小时 |
| S3 | 第5-6周 | 核心API | 计划/路线/日程/景点API | 10小时 |
| S4 | 第7-8周 | LLM集成 | AI行程规划、旅行问答 | 12小时 |
| S5 | 第9-10周 | Web完整版 | 打卡/美食/地图/预算 + 优化 | 10小时 |
| S6 | 第11-12周 | 部署上线 | PostgreSQL迁移、Vercel+Railway部署 | 8小时 |
| S7 | 第13-15周 | 小程序 | 小程序基础框架 + 核心页面 | 12小时 |
| S8 | 第16-17周 | 小程序功能 | 小程序全部功能开发 | 12小时 |
| S9 | 第18-20周 | 发布 | 测试、文档、小程序审核、发布 | 10小时 |

### 9.3 个人开发者时间分配建议

```
每周投入：约 10-12 小时
├── 开发编码：60% (6-7小时)
├── 调试测试：20% (2-2.5小时)
├── 文档学习：10% (1-1.5小时)
└── 规划复盘：10% (1-1.5小时)

建议节奏：
- 工作日：每天 1-1.5 小时（聚焦编码）
- 周末：每天 3-4 小时（聚焦功能开发）
```

---

## 10. 文档与交付物

### 10.1 文档清单

| 文档 | 编写阶段 | 格式 | 负责人 |
|------|---------|------|--------|
| 需求规格说明书 | 第1周 | Markdown | 开发者本人 |
| 系统架构设计文档 | 第2周 | Markdown | 开发者本人 |
| 数据库设计文档 | 第3周 | Markdown + Prisma Schema | 开发者本人 |
| API接口文档 | 第3-8周 | Swagger/OpenAPI | 开发者本人 |
| LLM Prompt文档 | 第6周 | Markdown | 开发者本人 |
| 部署手册 | 第11周 | Markdown | 开发者本人 |
| 用户手册 | 第18周 | Markdown | 开发者本人 |

### 10.2 交付物清单

| 序号 | 交付物 | 位置 | 交付时间 |
|------|--------|------|---------|
| 1 | Web前端源码 | front/ | 第10周 |
| 2 | 后端源码 | backend/ | 第12周 |
| 3 | 小程序源码 | miniprogram/ | 第17周 |
| 4 | 数据库Schema | backend/prisma/ | 第3周 |
| 5 | API文档 | backend/swagger/ | 第8周 |
| 6 | 部署配置 | Dockerfile, vercel.json | 第11周 |
| 7 | 用户手册 | docs/user-guide.md | 第18周 |

---

## 附录

### A. 环境变量配置 (.env)

```env
# 服务器
PORT=8080
NODE_ENV=development

# 数据库 (MVP阶段)
DATABASE_URL="file:./dev.db"

# 数据库 (生产阶段 - Supabase)
# DATABASE_URL="postgresql://user:pass@host:5432/db"

# 认证
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# LLM - 阿里云通义千问 (默认)
LLM_PROVIDER=dashscope
DASHSCOPE_API_KEY=sk-xxx
DASHSCOPE_MODEL=qwen-turbo

# LLM - OpenAI (备选)
# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk-xxx
# OPENAI_MODEL=gpt-4o-mini

# 文件存储 - Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
SUPABASE_BUCKET=travel-images

# 天气 - 和风天气
QWEATHER_API_KEY=xxx
QWEATHER_LOCATION_ID=xxx

# 前端URL (CORS)
FRONTEND_URL=http://localhost:3000
```

### B. 项目启动命令

```bash
# 后端启动
cd backend
npm install
npx prisma generate
npx prisma db push        # 创建SQLite数据库
npx prisma db seed        # 填充种子数据
npm run dev               # 启动开发服务器

# 前端启动 (使用现有原型)
cd front
# 直接用浏览器打开 index.html
# 或启动简单服务器：
npx serve .

# LLM测试
curl -X POST http://localhost:8080/v1/llm/itinerary \
  -H "Content-Type: application/json" \
  -d '{"destination":"大理","days":3,"budget":3000}'
```

### C. 开发规范

| 规范 | 工具 | 说明 |
|------|------|------|
| 代码规范 | ESLint + Prettier | 自动格式化 |
| 提交规范 | Conventional Commits | feat/fix/docs/refactor |
| 分支策略 | Git Flow (简化版) | main / dev / feature-* |
| TypeScript | strict模式 | 类型安全 |

---

> **文档维护**: 本计划为动态文档，将根据项目实际进展定期更新。
>
> **最后更新**: 2026年6月1日
