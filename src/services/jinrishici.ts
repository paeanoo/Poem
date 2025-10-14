// 今日诗词 API 简易封装
// 文档: https://www.jinrishici.com/doc/

export type JrsSentence = {
  id: string
  content: string
  origin: {
    title: string
    author: string
    dynasty?: string
    content?: string[]
  }
}

const JRS_ENDPOINT = 'https://v2.jinrishici.com/sentence'
const TOKEN = (import.meta as any).env?.VITE_JRS_TOKEN as string | undefined

export async function fetchSentence(token: string | undefined = TOKEN): Promise<JrsSentence> {
  const headers: Record<string, string> = {}
  if (token) headers['X-User-Token'] = token
  const res = await fetch(JRS_ENDPOINT, { headers, credentials: 'include' })
  if (!res.ok) throw new Error(`jinrishici ${res.status}`)
  const data = await res.json()
  // API 返回可能包在 {status,data} 结构里
  return (data.data ?? data) as JrsSentence
}

export async function fetchMultiple(n: number, token: string | undefined = TOKEN): Promise<JrsSentence[]> {
  const list: JrsSentence[] = []
  for (let i = 0; i < n; i++) {
    try {
      list.push(await fetchSentence(token))
    } catch {
      // 忽略单次失败
    }
  }
  return list
}


