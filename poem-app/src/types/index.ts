// 诗词相关类型定义

/** 诗词基本信息 */
export interface Poem {
  id: string
  title: string
  author: string
  dynasty: string
  content: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

/** 诗人信息 */
export interface Poet {
  id: string
  name: string
  dynasty: string
  biography: string
  style: string
  representativeWorks: string[]
  birthYear?: number
  deathYear?: number
}

/** 朝代信息 */
export interface Dynasty {
  id: string
  name: string
  startYear: number
  endYear: number
  description: string
  culturalBackground: string
  poetryCharacteristics: string[]
}

/** 诗词赏析 */
export interface PoemAnalysis {
  id: string
  poemId: string
  type: 'basic' | 'advanced' | 'expert'
  content: {
    background?: string
    theme?: string
    techniques?: string[]
    emotions?: string[]
    imagery?: string[]
    translation?: string
    appreciation?: string
  }
  aiGenerated: boolean
  expertReviewed: boolean
  createdAt: string
}

/** 用户信息 */
export interface User {
  id: string
  username: string
  nickname: string
  avatar?: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  preferences: {
    dynasties: string[]
    poets: string[]
    themes: string[]
  }
  stats: {
    studiedPoems: number
    favoritePoems: number
    studyTime: number
  }
  createdAt: string
}

/** 收藏夹 */
export interface Collection {
  id: string
  userId: string
  name: string
  description?: string
  poems: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

/** 搜索参数 */
export interface SearchParams {
  keyword?: string
  author?: string
  dynasty?: string
  tags?: string[]
  page?: number
  limit?: number
}

/** 搜索结果 */
export interface SearchResult {
  poems: Poem[]
  total: number
  page: number
  limit: number
}

/** API响应格式 */
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

/** 学习记录 */
export interface StudyRecord {
  id: string
  userId: string
  poemId: string
  action: 'read' | 'favorite' | 'study' | 'recite'
  duration?: number
  progress?: number
  createdAt: string
}