import type { Poem, SearchParams } from '@/types'

const API_BASE = import.meta.env.VITE_POETRY_API as string | undefined

type RemotePoem = {
  id?: string
  title: string
  author: string
  dynasty?: string
  content?: string | string[]
  paragraphs?: string[]
  tags?: string[]
}

function normalizeContent(input?: string | string[], paragraphs?: string[]): string[] {
  // 优先使用后端提供的分段数组，保持原文
  if (Array.isArray(paragraphs) && paragraphs.length) return paragraphs
  // 如果已经是数组，直接返回，保持原文
  if (Array.isArray(input)) return input
  // 若为单个字符串，仅按换行拆分，保留所有原始标点与符号
  if (typeof input === 'string') {
    const lines = input.split(/[\r\n]+/).map(s => s.trim()).filter(Boolean)
    return lines.length ? lines : [input]
  }
  return []
}

function normalize(poem: RemotePoem): Poem {
  return {
    id: poem.id ?? `${poem.title}-${poem.author}`,
    title: poem.title,
    author: poem.author,
    dynasty: poem.dynasty ?? '',
    content: normalizeContent(poem.content, poem.paragraphs),
    tags: poem.tags ?? [],
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  }
}

async function fetchLocal(): Promise<Poem[]> {
  const res = await fetch('/poems.json', { cache: 'no-store' })
  if (!res.ok) throw new Error(`local poems.json ${res.status}`)
  const data = await res.json()
  return (data as RemotePoem[]).map(normalize)
}

export async function fetchPoemsRemote(params?: SearchParams): Promise<Poem[]> {
  // If no API configured, throw to trigger fallback
  if (!API_BASE) throw new Error('no api configured')

  const url = new URL('/poems', API_BASE)
  if (params?.keyword) url.searchParams.set('q', params.keyword)
  if (params?.author) url.searchParams.set('author', params.author)
  if (params?.dynasty) url.searchParams.set('dynasty', params.dynasty)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`remote ${res.status}`)
  const data = (await res.json()) as RemotePoem[]
  return data.map(normalize)
}

export async function getPoems(params?: SearchParams): Promise<Poem[]> {
  try {
    return await fetchPoemsRemote(params)
  } catch {
    return await fetchLocal()
  }
}

export async function getPoemById(id: string): Promise<Poem | null> {
  const list = await getPoems()
  return list.find(p => p.id === id) ?? null
}

export async function searchPoems(params: SearchParams): Promise<Poem[]> {
  const list = await getPoems()
  let result = list
  if (params.keyword) {
    const k = params.keyword
    result = result.filter(p => p.title.includes(k) || p.content.some(l => l.includes(k)))
  }
  if (params.author) result = result.filter(p => p.author === params.author)
  if (params.dynasty) result = result.filter(p => p.dynasty === params.dynasty)
  return result
}


