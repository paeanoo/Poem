import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth as supabaseAuth, supabase } from '@/services/supabase'
import type { AuthUser } from '@/types/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const setUserFromSession = async () => {
    const { data } = await supabaseAuth.getCurrentUser()
    user.value = (data.user as unknown as AuthUser) ?? null
  }
  // 立即初始化（不要使用 onMounted）
  void setUserFromSession()
  // 直接使用回调入参，避免竞态导致登出被旧会话覆盖
  supabaseAuth.onAuthStateChange((_event, session) => {
    user.value = (session?.user as unknown as AuthUser) ?? null
  })

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabaseAuth.signIn(email, password)
    if (err) {
      // 统一用户可读的错误消息
      const msg = err.message || ''
      if (/confirm/i.test(msg) || /not confirmed/i.test(msg)) {
        error.value = '邮箱未验证，请前往邮箱完成验证后再登录'
      } else {
        error.value = msg
      }
    }
    user.value = (data.user as unknown as AuthUser) ?? null
    loading.value = false
    return { data, error: err }
  }

  const signUp = async (email: string, password: string, profile?: { username?: string | null }) => {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabaseAuth.signUp(email, password)
    if (err) {
      error.value = err.message
    }
    // 注册后通常需要邮箱验证，不直接设置已登录用户
    user.value = null
    // 预创建用户资料（等用户验证后首次登录可更新）
    if (!err && profile?.username) {
      try {
        const emailLower = email.toLowerCase()
        // 仅保存临时映射信息，正式资料在邮箱验证登录后创建
        await supabase.from('user_profiles').upsert({
          id: crypto.randomUUID(),
          username: profile.username,
          email: emailLower,
          created_at: new Date().toISOString()
        } as unknown as import('@/types/supabase').Database['public']['Tables']['user_profiles']['Insert'])
      } catch {
        // 忽略预创建失败
      }
    }
    loading.value = false
    return { data, error: err }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabaseAuth.signOut()
      if (err) error.value = err.message
      return { error: err }
    } catch (e) {
      // 记录意外异常信息
      const msg = e instanceof Error ? e.message : String(e)
      error.value = msg
      return { error: new Error(msg) }
    } finally {
      // 无论成功与否，清空本地用户并结束加载，避免前端卡在已登录状态
      user.value = null
      loading.value = false
    }
  }

  const resendConfirmation = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      // 使用 supabase 的重发验证邮件能力（v2）
      const { error: err } = await supabase.auth.resend({ type: 'signup', email })
      if (err) error.value = err.message
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  return { user, loading, error, signIn, signUp, signOut, resendConfirmation }
})


