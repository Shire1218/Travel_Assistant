<script lang="ts" setup>
import type { PlanItem, PlanParams } from '#/api';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  RangePicker,
  Row,
  Tag,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  copyPlanApi,
  createPlanApi,
  deletePlanApi,
  getPlanListApi,
  updatePlanApi,
} from '#/api';

const Textarea = Input.TextArea;

defineOptions({ name: 'PlanList' });

const loading = ref(false);
const planList = ref<PlanItem[]>([]);

/** 弹窗状态 */
const modalVisible = ref(false);
const saving = ref(false);
/** 编辑中的计划 ID（null 表示新建） */
const editingId = ref<null | number>(null);

const formState = reactive({
  title: '',
  range: undefined as [dayjs.Dayjs, dayjs.Dayjs] | undefined,
  companionCount: 1,
  coverImage: '',
  budgetTotal: '',
  remark: '',
});

const formRules = computed(() => ({
  title: [{ required: true, message: '请输入计划标题' }],
  range: [{ required: true, message: '请选择出行日期范围' }],
}));

/** 计划天数（按日期范围计算） */
function calcDays(plan: PlanItem): number {
  const start = dayjs(plan.startDate);
  const end = dayjs(plan.endDate);
  return Math.max(1, end.diff(start, 'day') + 1);
}

async function fetchList() {
  loading.value = true;
  try {
    planList.value = await getPlanListApi();
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void fetchList();
});

/** 打开新建弹窗 */
function openCreate() {
  editingId.value = null;
  Object.assign(formState, {
    title: '',
    range: undefined,
    companionCount: 1,
    coverImage: '',
    budgetTotal: '',
    remark: '',
  });
  modalVisible.value = true;
}

/** 打开编辑弹窗 */
function openEdit(plan: PlanItem) {
  editingId.value = plan.id;
  Object.assign(formState, {
    title: plan.title,
    range: [dayjs(plan.startDate), dayjs(plan.endDate)],
    companionCount: plan.companionCount,
    coverImage: plan.coverImage ?? '',
    budgetTotal: plan.budgetTotal ?? '',
    remark: plan.remark ?? '',
  });
  modalVisible.value = true;
}

/** 表单 → 请求参数 */
function buildParams(): PlanParams {
  const [start, end] = formState.range!;
  return {
    title: formState.title.trim(),
    startDate: (start as dayjs.Dayjs).format('YYYY-MM-DD'),
    endDate: (end as dayjs.Dayjs).format('YYYY-MM-DD'),
    companionCount: formState.companionCount,
    coverImage: formState.coverImage.trim() || undefined,
    budgetTotal: formState.budgetTotal || undefined,
    remark: formState.remark.trim() || undefined,
  };
}

/** 保存（新建/编辑） */
async function handleSave() {
  if (!formState.title.trim()) {
    message.warning('请输入计划标题');
    return;
  }
  if (!formState.range) {
    message.warning('请选择出行日期范围');
    return;
  }
  saving.value = true;
  try {
    if (editingId.value === null) {
      await createPlanApi(buildParams());
      message.success('计划已创建');
    } else {
      await updatePlanApi(editingId.value, buildParams());
      message.success('计划已保存');
    }
    modalVisible.value = false;
    await fetchList();
  } finally {
    saving.value = false;
  }
}

/** 复制计划（SRS F2.3，M1 阶段复制元信息） */
async function handleCopy(plan: PlanItem) {
  await copyPlanApi(plan.id);
  message.success('已复制计划');
  await fetchList();
}

/** 删除计划（SRS F2.4 二次确认由 Popconfirm 承担） */
async function handleDelete(plan: PlanItem) {
  await deletePlanApi(plan.id);
  message.success('已删除');
  await fetchList();
}
</script>

<template>
  <Page
    title="我的计划"
    description="管理你的旅行计划，点击卡片进入计划（行程编排将在后续里程碑开放）"
  >
    <template #extra>
      <Button type="primary" @click="openCreate">新建计划</Button>
    </template>

    <Empty
      v-if="!loading && planList.length === 0"
      description="还没有计划，点击右上角「新建计划」开始"
    />

    <Row :gutter="[16, 16]">
      <Col v-for="plan in planList" :key="plan.id" :lg="8" :md="12" :xs="24">
        <Card hoverable :loading="loading">
          <template #cover>
            <img
              v-if="plan.coverImage"
              :alt="plan.title"
              :src="plan.coverImage"
              class="h-40 w-full object-cover"
            />
            <div
              v-else
              class="flex h-40 w-full items-center justify-center bg-gradient-to-br from-teal-400 to-sky-600 text-4xl"
            >
              ✈️
            </div>
          </template>
          <Card.Meta>
            <template #title>
              <span class="text-base font-medium">{{ plan.title }}</span>
            </template>
            <template #description>
              <div class="flex flex-col gap-1">
                <div>
                  {{ plan.startDate }} ~ {{ plan.endDate }}
                  <Tag class="ml-1" color="blue">{{ calcDays(plan) }} 天</Tag>
                  <Tag color="green">{{ plan.companionCount }} 人</Tag>
                </div>
                <div v-if="plan.budgetTotal" class="text-orange-600">
                  预算上限：¥{{ plan.budgetTotal }}
                </div>
                <div
                  v-if="plan.remark"
                  class="line-clamp-2 text-gray-500"
                >
                  {{ plan.remark }}
                </div>
              </div>
            </template>
          </Card.Meta>
          <template #actions>
            <Button type="link" size="small" @click="openEdit(plan)">
              编辑
            </Button>
            <Button type="link" size="small" @click="handleCopy(plan)">
              复制
            </Button>
            <Popconfirm
              title="确定删除该计划吗？"
              @confirm="handleDelete(plan)"
            >
              <Button type="link" danger size="small">删除</Button>
            </Popconfirm>
          </template>
        </Card>
      </Col>
    </Row>

    <Modal
      v-model:open="modalVisible"
      :confirm-loading="saving"
      :title="editingId === null ? '新建计划' : '编辑计划'"
      @ok="handleSave"
    >
      <Form layout="vertical" :rules="formRules" :model="formState">
        <FormItem label="标题" name="title">
          <Input
            v-model:value="formState.title"
            :maxlength="100"
            placeholder="如：西湖三日游"
          />
        </FormItem>
        <FormItem label="出行日期范围" name="range">
          <RangePicker
            v-model:value="formState.range"
            class="w-full"
            format="YYYY-MM-DD"
          />
        </FormItem>
        <FormItem label="同行人数">
          <InputNumber
            v-model:value="formState.companionCount"
            :min="1"
            :max="99"
            class="w-full"
          />
        </FormItem>
        <FormItem label="封面图 URL（可不填）">
          <Input
            v-model:value="formState.coverImage"
            :maxlength="500"
            placeholder="封面图片地址（上传功能后续里程碑提供）"
          />
        </FormItem>
        <FormItem label="总预算上限（元，可不填）">
          <Input
            v-model:value="formState.budgetTotal"
            placeholder="如：5000"
          />
        </FormItem>
        <FormItem label="备注">
          <Textarea
            v-model:value="formState.remark"
            :maxlength="1000"
            :rows="3"
            placeholder="计划备注"
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
