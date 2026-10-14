<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationRegister, z } from '@vben/common-ui';
import { LOGIN_PATH } from '@vben/constants';

import { message } from 'ant-design-vue';

import { registerApi } from '#/api';

defineOptions({ name: 'Register' });

const router = useRouter();
const loading = ref(false);

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入用户名（至少 2 个字符）',
      },
      fieldName: 'username',
      label: '用户名',
      rules: z
        .string()
        .min(2, { message: '用户名至少 2 个字符' })
        .max(50, { message: '用户名最长 50 个字符' }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '昵称（可选，默认同用户名）',
      },
      fieldName: 'nickname',
      label: '昵称',
      rules: z.string().max(50, { message: '昵称最长 50 个字符' }).optional(),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: '请输入密码（至少 6 位）',
      },
      fieldName: 'password',
      label: '密码',
      renderComponentContent() {
        return {
          strengthText: () => '密码强度提示',
        };
      },
      rules: z
        .string()
        .min(6, { message: '密码至少 6 位' })
        .max(50, { message: '密码最长 50 位' }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: '请再次输入密码',
      },
      dependencies: {
        rules(values) {
          const { password } = values;
          return z
            .string({ error: '请再次输入密码' })
            .min(1, { message: '请再次输入密码' })
            .refine((value) => value === password, {
              message: '两次输入的密码不一致',
            });
        },
        triggerFields: ['password'],
      },
      fieldName: 'confirmPassword',
      label: '确认密码',
    },
  ];
});

/** 注册成功后跳转登录页 */
async function handleSubmit(values: Recordable<any>) {
  loading.value = true;
  try {
    await registerApi({
      nickname: values.nickname || undefined,
      password: values.password,
      username: values.username,
    });
    message.success('注册成功，请登录');
    await router.push(LOGIN_PATH);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <AuthenticationRegister
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
