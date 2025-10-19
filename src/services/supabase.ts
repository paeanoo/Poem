import { createClient } from '@supabase/supabase-js'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建supabase客户端实例
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 用户认证相关方法
export const auth = {
  // 用户登录
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 用户注册
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  },

  // 用户登出
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 获取当前用户
  getCurrentUser() {
    return supabase.auth.getUser()
  },

  // 监听认证状态变化
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// 诗词收藏相关方法
export const collections = {
  // 获取用户收藏的诗词
  async getUserCollections(userId: string) {
    const { data, error } = await supabase
      .from('user_collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // 添加诗词到收藏
  async addToCollection(userId: string, poemId: string, poemData: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('user_collections')
      .insert({
        user_id: userId,
        poem_id: poemId,
        poem_data: poemData,
        created_at: new Date().toISOString()
      })
      .select()

    return { data, error }
  },

  // 从收藏中移除诗词
  async removeFromCollection(collectionId: string) {
    const { error } = await supabase
      .from('user_collections')
      .delete()
      .eq('id', collectionId)

    return { error }
  },

  // 检查诗词是否已收藏
  async isPoemCollected(userId: string, poemId: string) {
    const { data, error } = await supabase
      .from('user_collections')
      .select('id')
      .eq('user_id', userId)
      .eq('poem_id', poemId)
      .single()

    return { isCollected: !!data, error }
  }
}

// 点赞相关方法
export const likes = {
  // 点赞诗词
  async likePoem(userId: string, poemId: string) {
    const { data, error } = await supabase
      .from('poem_likes')
      .insert({
        user_id: userId,
        poem_id: poemId,
        created_at: new Date().toISOString()
      })
      .select()

    return { data, error }
  },

  // 取消点赞
  async unlikePoem(userId: string, poemId: string) {
    const { error } = await supabase
      .from('poem_likes')
      .delete()
      .eq('user_id', userId)
      .eq('poem_id', poemId)

    return { error }
  },

  // 检查是否已点赞
  async isPoemLiked(userId: string, poemId: string) {
    const { data, error } = await supabase
      .from('poem_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('poem_id', poemId)
      .single()

    return { isLiked: !!data, error }
  },

  // 获取诗词点赞数
  async getPoemLikeCount(poemId: string) {
    const { count, error } = await supabase
      .from('poem_likes')
      .select('*', { count: 'exact', head: true })
      .eq('poem_id', poemId)

    return { count: count || 0, error }
  }
}

// 社区功能相关方法
export const community = {
  // 获取社区评论
  async getPoemComments(poemId: string) {
    const { data, error } = await supabase
      .from('poem_comments')
      .select('*, user_profiles(username, avatar)')
      .eq('poem_id', poemId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // 添加评论
  async addComment(poemId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from('poem_comments')
      .insert({
        poem_id: poemId,
        user_id: userId,
        content,
        created_at: new Date().toISOString()
      })
      .select()

    return { data, error }
  },

  // 删除评论
  async deleteComment(commentId: string, userId: string) {
    const { error } = await supabase
      .from('poem_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    return { error }
  }
}

// 用户资料相关方法
export const profiles = {
  // 获取用户资料
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  },

  // 更新用户资料
  async updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['user_profiles']['Update']>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()

    return { data, error }
  },

  // 创建用户资料
  async createUserProfile(userId: string, profileData: Omit<Database['public']['Tables']['user_profiles']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date().toISOString()
      })
      .select()

    return { data, error }
  }
}

export default supabase
