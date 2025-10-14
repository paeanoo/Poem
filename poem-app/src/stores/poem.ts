import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, PoemAnalysis, SearchParams, SearchResult } from '@/types'

export const usePoemStore = defineStore('poem', () => {
  // 状态
  const poems = ref<Poem[]>([])
  const currentPoem = ref<Poem | null>(null)
  const currentAnalysis = ref<PoemAnalysis | null>(null)
  const searchResult = ref<SearchResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const poemsCount = computed(() => poems.value.length)
  const dynastyList = computed(() => {
    const dynasties = new Set(poems.value.map(poem => poem.dynasty))
    return Array.from(dynasties)
  })
  const authorList = computed(() => {
    const authors = new Set(poems.value.map(poem => poem.author))
    return Array.from(authors)
  })

  // 方法
  const fetchPoems = async (params?: SearchParams) => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用，使用传入的params参数
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 这里应该是实际的API调用，使用传入的params参数
      // const response = await api.getPoems(params)
      // poems.value = response.data
      
      // 根据params参数进行过滤（模拟）
      let filteredPoems = [
        {
          id: '1',
          title: '静夜思',
          author: '李白',
          dynasty: '唐',
          content: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
          tags: ['思乡', '月亮', '夜晚'],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '2',
          title: '春晓',
          author: '孟浩然',
          dynasty: '唐',
          content: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
          tags: ['春天', '自然', '感慨'],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ]
      
      // 如果传入了params参数，进行过滤
      if (params) {
        if (params.author) {
          filteredPoems = filteredPoems.filter(poem => poem.author === params.author)
        }
        if (params.dynasty) {
          filteredPoems = filteredPoems.filter(poem => poem.dynasty === params.dynasty)
        }
        if (params.keyword) {
          filteredPoems = filteredPoems.filter(poem =>
            poem.title.includes(params.keyword!) ||
            poem.content.some(line => line.includes(params.keyword!))
          )
        }
      }
      
      poems.value = filteredPoems
      
      // 临时使用模拟数据
      const mockPoems: Poem[] = [
        {
          id: '1',
          title: '静夜思',
          author: '李白',
          dynasty: '唐',
          content: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
          tags: ['思乡', '月亮', '夜晚'],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '2',
          title: '春晓',
          author: '孟浩然',
          dynasty: '唐',
          content: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
          tags: ['春天', '自然', '感慨'],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ]
      
      poems.value = mockPoems
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取诗词失败'
    } finally {
      loading.value = false
    }
  }

  const fetchPoemById = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const poem = poems.value.find(p => p.id === id)
      if (poem) {
        currentPoem.value = poem
      } else {
        throw new Error('诗词不存在')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取诗词详情失败'
    } finally {
      loading.value = false
    }
  }

  const fetchPoemAnalysis = async (poemId: string, type: 'basic' | 'advanced' | 'expert' = 'basic') => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟赏析数据
      const mockAnalysis: PoemAnalysis = {
        id: `analysis_${poemId}_${type}`,
        poemId,
        type,
        content: {
          background: '这首诗创作于诗人思乡之时...',
          theme: '表达了诗人对故乡的深切思念',
          techniques: ['对比', '意象', '情景交融'],
          emotions: ['思乡', '孤独', '怀念'],
          imagery: ['明月', '霜', '故乡'],
          translation: '床前洒满了明亮的月光，以为是地上结了一层白霜。抬起头来看那天窗外空中的明月，不由得低头思念起故乡来。',
          appreciation: '全诗语言清新朴素，韵律和谐，意境深远，情感真挚，是思乡诗的经典之作。'
        },
        aiGenerated: true,
        expertReviewed: true,
        createdAt: '2024-01-01'
      }
      
      currentAnalysis.value = mockAnalysis
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取诗词赏析失败'
    } finally {
      loading.value = false
    }
  }

  const searchPoems = async (params: SearchParams) => {
    loading.value = true
    error.value = null
    
    try {
      // 模拟搜索API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      let filteredPoems = poems.value
      
      if (params.keyword) {
        filteredPoems = filteredPoems.filter(poem =>
          poem.title.includes(params.keyword!) ||
          poem.content.some(line => line.includes(params.keyword!))
        )
      }
      
      if (params.author) {
        filteredPoems = filteredPoems.filter(poem => poem.author === params.author)
      }
      
      if (params.dynasty) {
        filteredPoems = filteredPoems.filter(poem => poem.dynasty === params.dynasty)
      }
      
      searchResult.value = {
        poems: filteredPoems,
        total: filteredPoems.length,
        page: params.page || 1,
        limit: params.limit || 20
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '搜索失败'
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentPoem = () => {
    currentPoem.value = null
    currentAnalysis.value = null
  }

  return {
    // 状态
    poems,
    currentPoem,
    currentAnalysis,
    searchResult,
    loading,
    error,
    
    // 计算属性
    poemsCount,
    dynastyList,
    authorList,
    
    // 方法
    fetchPoems,
    fetchPoemById,
    fetchPoemAnalysis,
    searchPoems,
    clearError,
    clearCurrentPoem
  }
})