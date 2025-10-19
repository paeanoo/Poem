import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, PoemAnalysis, SearchParams, SearchResult } from '@/types'
import * as PoetryService from '@/services/poetry'

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
      console.log('📚 获取诗词数据:', params)
      // 先尝试远端 API，失败回退本地 JSON
      let filteredPoems: Poem[] = await PoetryService.getPoems(params)
      console.log('📚 获取到诗词数量:', filteredPoems.length)

      // 如果传入了params参数，进行额外过滤（服务层已经处理了大部分过滤）
      if (params) {
        if (params.author) {
          filteredPoems = filteredPoems.filter(poem => poem.author.toLowerCase().includes(params.author!.toLowerCase()))
        }
        if (params.dynasty) {
          filteredPoems = filteredPoems.filter(poem => poem.dynasty === params.dynasty)
        }
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase()
          filteredPoems = filteredPoems.filter(poem =>
            poem.title.toLowerCase().includes(keyword) ||
            poem.author.toLowerCase().includes(keyword) ||
            poem.content.some(line => line.toLowerCase().includes(keyword))
          )
        }
      }

      console.log('📚 最终诗词数量:', filteredPoems.length)
      poems.value = filteredPoems
    } catch (err) {
      console.error('❌ 获取诗词失败:', err)
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

      const poem = poems.value.find(p => p.id === id) || await PoetryService.getPoemById(id)
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

      const target = poems.value.find(p => p.id === poemId)
      // 按诗词生成对应的简要赏析，避免套用同一内容
      let content: PoemAnalysis['content'] = {}
      if (target) {
        switch (target.title) {
          case '静夜思':
            content = {
              background: '李白旅居异乡时的即景之作。',
              theme: '借月抒怀，表达浓重的思乡之情。',
              techniques: ['对比', '意象', '对仗'],
              emotions: ['思乡', '孤独'],
              imagery: ['明月', '霜'],
              translation: '床前月光如霜。我抬头望月，低头思念故乡。',
              appreciation: '语言浅白却意境深远，四句起承转合，读来朗朗上口。'
            }
            break
          case '春晓':
            content = {
              background: '孟浩然隐居鹿门山时期的作品。',
              theme: '以春眠与鸟鸣写春天生机与感怀。',
              techniques: ['对仗', '动静结合'],
              emotions: ['恬淡', '感慨'],
              imagery: ['春眠', '啼鸟', '风雨', '落花'],
              translation: '春天睡觉不知天已大亮，到处听见鸟叫。昨夜又起了风雨，不知花落了多少。',
              appreciation: '清新自然，含蓄见深情，结句设问耐人寻味。'
            }
            break
          case '水调歌头·明月几时有':
            content = {
              background: '苏轼中秋与弟苏辙相隔两地所作。',
              theme: '借月抒怀，超越羁离的人生达观。',
              techniques: ['比兴', '哲理抒情', '由景入情'],
              emotions: ['思亲', '旷达'],
              imagery: ['明月', '宫阙'],
              translation: '明月何时出现？举杯问青天……（略）',
              appreciation: '豪放而蕴哲思，情景交融，境界高远。'
            }
            break
          default:
            content = {
              background: `${target.author}《${target.title}》简要赏析。`,
              theme: '主题以原文为据，可进一步扩充。'
            }
        }
      }

      currentAnalysis.value = {
        id: `analysis_${poemId}_${type}`,
        poemId,
        type,
        content,
        aiGenerated: true,
        expertReviewed: false,
        createdAt: '2024-01-01'
      }
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
      console.log('🔍 开始搜索:', params)
      // 使用服务层：优先远端完整数据，失败回退本地
      const result = await PoetryService.searchPoems(params)
      console.log('📚 搜索结果:', result.length, '首诗词')

      // 同步到全局诗词列表，便于后续详情直接命中
      poems.value = result
      searchResult.value = {
        poems: result,
        total: result.length,
        page: params.page || 1,
        limit: params.limit || 20,
      }
    } catch (err) {
      console.error('❌ 搜索失败:', err)
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

  // 工具：根据标题查找诗词ID（宽松匹配）
  const findPoemIdByTitle = (title: string): string | null => {
    const lower = title.toLowerCase()
    const found = poems.value.find(p => p.title.toLowerCase().includes(lower))
    return found ? found.id : null
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
    clearCurrentPoem,
    findPoemIdByTitle
  }
})
