<script setup lang="ts" name="LoginView">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthStore()
const email = ref('')
const password = ref('')
const isLogin = ref(true)
const formError = ref<string | null>(null)
const info = ref<string | null>(null)
const username = ref('')

const isValidEmail = (value: string) => {
  const v = value.trim()
  // 简单 RFC5322 兼容的邮箱格式校验（够用即可）
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)
}

// 额外：邮箱可达性校验（DNS MX记录）
const hasMxRecord = async (mail: string): Promise<boolean> => {
  try {
    const domain = mail.split('@')[1]
    if (!domain) return false
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, { cache: 'no-store' })
    if (!res.ok) return false
    const data: { Status?: number; Answer?: unknown[] } = await res.json()
    // Status === 0 表示无错误，且存在 Answer 记录视为可达
    return (data.Status === 0) && Array.isArray(data.Answer) && data.Answer.length > 0
  } catch {
    // DNS检查失败时不放行，提示用户检查邮箱
    return false
  }
}

const onSubmit = async () => {
  formError.value = null
  if (!email.value || !password.value) {
    formError.value = '请输入邮箱和密码'
    return
  }
  if (isLogin.value) {
    const { error } = await store.signIn(email.value, password.value)
    if (!error) router.push('/')
  } else {
    // 注册前校验邮箱格式有效性，避免错误邮箱导致后续无法登录
    if (!isValidEmail(email.value)) {
      formError.value = '邮箱格式不正确，请检查后重试'
      return
    }
    // 进一步做域名可达性校验（MX记录）
    const mxOk = await hasMxRecord(email.value)
    if (!mxOk) {
      formError.value = '该邮箱域名无法接收邮件，请更换邮箱（或检查是否输入有误）'
      return
    }
    if (!username.value.trim()) {
      formError.value = '请输入用户名'
      return
    }
    const { error } = await store.signUp(email.value, password.value, { username: username.value.trim() })
    if (!error) {
      // 不直接登录，提示去邮箱验证
      formError.value = null
      // 展示提示，并提供重发邮件
      info.value = '注册成功，请前往邮箱完成验证后再登录。'
    }
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="card">
      <h1>{{ isLogin ? '登录' : '注册' }}</h1>
      <div class="field">
        <label>邮箱</label>
        <input v-model="email" type="email" placeholder="you@example.com" />
      </div>
      <div class="field" v-if="!isLogin">
        <label>用户名</label>
        <input v-model="username" type="text" placeholder="起一个独特的名字" />
      </div>
      <div class="field">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="******" />
      </div>
      <button class="primary" @click="onSubmit" :disabled="store.loading">
        {{ store.loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
      </button>
      <p class="switch">
        <span @click="isLogin = !isLogin">{{ isLogin ? '还没有账号？去注册' : '已有账号？去登录' }}</span>
      </p>
      <p class="info" v-if="info">{{ info }}</p>
      <p class="error" v-else-if="formError">{{ formError }}</p>
      <p class="error" v-else-if="store.error">{{ store.error }}</p>
      <button v-if="info && !isLogin" class="link" @click="store.resendConfirmation(email)">重发验证邮件</button>
    </div>
  </div>

</template>

<style scoped>
.auth-wrap {
  min-height: calc(100vh - 56px - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}
.card {
  width: 100%;
  max-width: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
}
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
.primary { width: 100%; padding: 10px 12px; border-radius: 8px; background: #111827; color: #fff; border: none; }
.switch { margin-top: 10px; text-align: center; color: #2563eb; cursor: pointer; }
.error { margin-top: 10px; color: #ef4444; }
</style>

