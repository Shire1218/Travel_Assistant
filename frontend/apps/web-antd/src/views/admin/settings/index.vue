<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Form, FormItem, Input, message } from 'ant-design-vue';

import { getSystemSettingsApi, updateSystemSettingsApi } from '#/api';

defineOptions({ name: 'AdminSettings' });

const loading = ref(false);
const saving = ref(false);

const formState = reactive({
  amapJsKey: '',
  amapWebServiceKey: '',
});

onMounted(async () => {
  loading.value = true;
  try {
    const settings = await getSystemSettingsApi();
    formState.amapJsKey = settings.amapJsKey ?? '';
    formState.amapWebServiceKey = settings.amapWebServiceKey ?? '';
  } finally {
    loading.value = false;
  }
});

/** 保存系统设置（SRS：高德两种 key 全局配置） */
async function handleSave() {
  saving.value = true;
  try {
    await updateSystemSettingsApi({
      amapJsKey: formState.amapJsKey.trim(),
      amapWebServiceKey: formState.amapWebServiceKey.trim(),
    });
    message.success('系统设置已保存');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Page title="系统设置" description="全局配置项（当前为高德开放平台两个 Key，后续里程碑的地图功能将使用）">
    <Card :loading="loading" class="max-w-xl" title="高德开放平台 Key">
      <Form layout="vertical">
        <FormItem
          extra="用于前端 JS API 2.0 地图渲染"
          label="Web端（JS API）Key"
        >
          <Input
            v-model:value="formState.amapJsKey"
            :maxlength="200"
            allow-clear
            placeholder="请输入高德 JS API Key"
          />
        </FormItem>
        <FormItem
          extra="用于后端 POI 搜索、逆地理编码、路径规划、静态地图"
          label="Web服务 Key"
        >
          <Input
            v-model:value="formState.amapWebServiceKey"
            :maxlength="200"
            allow-clear
            placeholder="请输入高德 Web 服务 Key"
          />
        </FormItem>
        <FormItem>
          <Button :loading="saving" type="primary" @click="handleSave">
            保存
          </Button>
        </FormItem>
      </Form>
    </Card>
  </Page>
</template>
