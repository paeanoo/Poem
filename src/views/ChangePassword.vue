<script setup lang="ts" name="ChangePassword">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const pwd = ref('')
const pwd2 = ref('')
const err = ref<string | null>(null)
const ok = ref<string | null>(null)

const onChange = async () => {
  err.value = null
  ok.value = null
  if (!auth.user) {
    err.value = '请先登录'
    return
  }
  if (!auth.user.email_confirmed_at) {
    err.value = '邮箱未验证，无法修改密码'
    return
  }
  if (!pwd.value || pwd.value.length < 6) {
    err.value = '密码至少6位'
    return
  }
  if (pwd.value !== pwd2.value) {
    err.value = '两次输入的密码不一致'
    return
  }
  const { error } = await supabase.auth.updateUser({ password: pwd.value })
  if (error) {
    err.value = error.message
  } else {
    ok.value = '密码已更新，请使用新密码重新登录'
    setTimeout(() => router.push('/login'), 1000)
  }
}
</script>

<template>
  <div class="wrap">
    <h1>修改密码</h1>
    <div class="card">
      <div class="field">
        <label>新密码</label>
        <input type="password" v-model="pwd" placeholder="至少6位" />
      </div>
      <div class="field">
        <label>确认新密码</label>
        <input type="password" v-model="pwd2" placeholder="再次输入" />
      </div>
      <button class="primary" @click="onChange">提交</button>
      <p v-if="err" class="error">{{ err }}</p>
      <p v-if="ok" class="ok">{{ ok }}</p>
    </div>
  </div>
</template>

<style scoped>
.wrap { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; background: #fff; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
.primary { width: 100%; padding: 10px 12px; border-radius: 8px; background: #111827; color: #fff; border: none; }
.error { color: #ef4444; }
.ok { color: #16a34a; }
</style>

