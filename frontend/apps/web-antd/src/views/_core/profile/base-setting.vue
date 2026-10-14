<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { Button, Card, Form, FormItem, Input, message } from 'ant-design-vue';

import { getUserInfoApi, updateProfileApi } from '#/api';

const userStore = useUserStore();
const saving = ref(false);

const formState = reactive({
  nickname: '',
  username: '',
});

onMounted(async () => {
  const data = await getUserInfoApi();
  formState.nickname = data.realName ?? '';
  formState.username = data.username ?? '';
});

/** 保存昵称（SRS F1.3 修改个人信息） */
async function handleSave() {
  if (!formState.nickname.trim()) {
    message.warning('昵称不能为空');
    return;
  }
  saving.value = true;
  try {
    await updateProfileApi(formState.nickname.trim());
    message.success('个人信息已更新');
    // 刷新全局用户信息展示
    const latest = await getUserInfoApi();
    userStore.setUserInfo(latest);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Card class="w-1/3" title="基本信息">
    <Form layout="vertical">
      <FormItem label="用户名">
        <Input v-model:value="formState.username" disabled />
      </FormItem>
      <FormItem label="昵称">
        <Input
          v-model:value="formState.nickname"
          :maxlength="50"
          placeholder="请输入昵称"
        />
      </FormItem>
      <FormItem>
        <Button :loading="saving" type="primary" @click="handleSave">
          保存
        </Button>
      </FormItem>
    </Form>
  </Card>
</template>
