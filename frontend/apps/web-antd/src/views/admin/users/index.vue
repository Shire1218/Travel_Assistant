<script lang="ts" setup>
import type { AdminUserItem } from '#/api';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Form,
  FormItem,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import {
  createAdminUserApi,
  getAdminUserListApi,
  resetAdminUserPasswordApi,
  updateAdminUserApi,
} from '#/api';

defineOptions({ name: 'AdminUsers' });

const userStore = useUserStore();

const loading = ref(false);
const userList = ref<AdminUserItem[]>([]);

/** 列表列定义 */
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'nickname' },
  { title: '角色', dataIndex: 'role', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', key: 'actions', width: 180 },
];

// ---------- 创建用户弹窗 ----------
const createVisible = ref(false);
const creating = ref(false);
const createForm = reactive({
  nickname: '',
  password: '',
  role: 'user' as 'admin' | 'user',
  username: '',
});

// ---------- 编辑用户弹窗 ----------
const editVisible = ref(false);
const editing = ref(false);
const editTarget = ref<AdminUserItem | null>(null);
const editForm = reactive({
  nickname: '',
  role: 'user' as 'admin' | 'user',
  status: 1,
});

// ---------- 重置密码弹窗 ----------
const resetVisible = ref(false);
const resetting = ref(false);
const resetTarget = ref<AdminUserItem | null>(null);
const resetPassword = ref('');

async function fetchList() {
  loading.value = true;
  try {
    userList.value = await getAdminUserListApi();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void fetchList();
});

/** 当前登录用户 ID（防止自禁/自降级，后端也会兜底校验） */
const currentUserId = userStore.userInfo?.userId;

function openCreate() {
  Object.assign(createForm, { nickname: '', password: '', role: 'user' });
  createVisible.value = true;
}

async function handleCreate() {
  if (!createForm.username.trim() || createForm.username.trim().length < 2) {
    message.warning('用户名至少 2 个字符');
    return;
  }
  if (createForm.password.length < 6) {
    message.warning('密码至少 6 位');
    return;
  }
  creating.value = true;
  try {
    await createAdminUserApi({
      nickname: createForm.nickname.trim() || undefined,
      password: createForm.password,
      role: createForm.role,
      username: createForm.username.trim(),
    });
    message.success('用户已创建');
    createVisible.value = false;
    await fetchList();
  } finally {
    creating.value = false;
  }
}

function openEdit(user: AdminUserItem) {
  editTarget.value = user;
  Object.assign(editForm, {
    nickname: user.nickname,
    role: user.role,
    status: user.status,
  });
  editVisible.value = true;
}

async function handleEdit() {
  if (!editTarget.value) return;
  if (!editForm.nickname.trim()) {
    message.warning('昵称不能为空');
    return;
  }
  editing.value = true;
  try {
    await updateAdminUserApi(editTarget.value.id, {
      nickname: editForm.nickname.trim(),
      role: editForm.role,
      status: editForm.status,
    });
    message.success('已保存');
    editVisible.value = false;
    await fetchList();
  } finally {
    editing.value = false;
  }
}

function openReset(user: AdminUserItem) {
  resetTarget.value = user;
  resetPassword.value = '';
  resetVisible.value = true;
}

async function handleReset() {
  if (!resetTarget.value) return;
  if (resetPassword.value.length < 6) {
    message.warning('密码至少 6 位');
    return;
  }
  resetting.value = true;
  try {
    await resetAdminUserPasswordApi(resetTarget.value.id, resetPassword.value);
    message.success('密码已重置');
    resetVisible.value = false;
  } finally {
    resetting.value = false;
  }
}

/** 启用/禁用（列表内快捷操作） */
async function toggleStatus(user: AdminUserItem) {
  await updateAdminUserApi(user.id, { status: user.status === 1 ? 0 : 1 });
  message.success(user.status === 1 ? '已禁用' : '已启用');
  await fetchList();
}

function roleText(role: string) {
  return role === 'admin' ? '管理员' : '普通用户';
}
</script>

<template>
  <Page title="用户管理" description="管理员可创建账号、编辑用户信息、重置密码（用户不可删除）">
    <template #extra>
      <Button type="primary" @click="openCreate">新建用户</Button>
    </template>

    <Table
      :columns="columns"
      :data-source="userList"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <Button
            type="link"
            size="small"
            @click="openEdit(record as AdminUserItem)"
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            @click="openReset(record as AdminUserItem)"
          >
            重置密码
          </Button>
          <Popconfirm
            v-if="String(record.id) !== currentUserId"
            :title="`确定${record.status === 1 ? '禁用' : '启用'}用户 ${record.username} 吗？`"
            @confirm="toggleStatus(record as AdminUserItem)"
          >
            <Button type="link" danger size="small">
              {{ record.status === 1 ? '禁用' : '启用' }}
            </Button>
          </Popconfirm>
        </template>
        <template v-else-if="column.dataIndex === 'role'">
          <Tag :color="record.role === 'admin' ? 'red' : 'blue'">
            {{ roleText(record.role) }}
          </Tag>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <Tag :color="record.status === 1 ? 'green' : 'gray'">
            {{ record.status === 1 ? '正常' : '禁用' }}
          </Tag>
        </template>
      </template>
    </Table>

    <!-- 新建用户 -->
    <Modal
      v-model:open="createVisible"
      :confirm-loading="creating"
      title="新建用户"
      @ok="handleCreate"
    >
      <Form layout="vertical" :model="createForm">
        <FormItem label="用户名" required>
          <Input
            v-model:value="createForm.username"
            :maxlength="50"
            placeholder="至少 2 个字符"
          />
        </FormItem>
        <FormItem label="昵称">
          <Input
            v-model:value="createForm.nickname"
            :maxlength="50"
            placeholder="默认同用户名"
          />
        </FormItem>
        <FormItem label="初始密码" required>
          <Input.Password
            v-model:value="createForm.password"
            :maxlength="50"
            placeholder="至少 6 位"
          />
        </FormItem>
        <FormItem label="角色">
          <Select v-model:value="createForm.role">
            <Select.Option value="user">普通用户</Select.Option>
            <Select.Option value="admin">管理员</Select.Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <!-- 编辑用户 -->
    <Modal
      v-model:open="editVisible"
      :confirm-loading="editing"
      :title="`编辑用户：${editTarget?.username ?? ''}`"
      @ok="handleEdit"
    >
      <Form layout="vertical" :model="editForm">
        <FormItem label="昵称" required>
          <Input v-model:value="editForm.nickname" :maxlength="50" />
        </FormItem>
        <FormItem
          v-if="String(editTarget?.id ?? '') !== currentUserId"
          label="角色"
        >
          <Select v-model:value="editForm.role">
            <Select.Option value="user">普通用户</Select.Option>
            <Select.Option value="admin">管理员</Select.Option>
          </Select>
        </FormItem>
        <FormItem v-if="String(editTarget?.id ?? '') !== currentUserId" label="状态">
          <Select v-model:value="editForm.status">
            <Select.Option :value="1">正常</Select.Option>
            <Select.Option :value="0">禁用</Select.Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <!-- 重置密码 -->
    <Modal
      v-model:open="resetVisible"
      :confirm-loading="resetting"
      :title="`重置密码：${resetTarget?.username ?? ''}`"
      @ok="handleReset"
    >
      <Form layout="vertical">
        <FormItem label="新密码" required>
          <Input.Password
            v-model:value="resetPassword"
            :maxlength="50"
            placeholder="至少 6 位"
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
