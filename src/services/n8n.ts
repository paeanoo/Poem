/**
 * n8n工作流服务（修正版）
 * 关键修正：
 * - 不设置 User-Agent
 * - 不在前端发送 Authorization（鉴权放到 body.metadata.apiKey 或走后端代理）
 * - fetch 显式使用 CORS（mode/credentials）
 * - 不再依赖 content-length；先 json 再回退 text
 * - 兼容 {analysis: ...} 等字段名
 * - 错误分类更稳；指数退避重试
 * - 完全类型安全的 TypeScript 实现
 * - 配置验证和错误处理优化
 */

export interface N8nWorkflowConfig {
  webhookUrl: string;
  apiKey?: string; // 不作为请求头发送
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ChatRequest {
  message: string;
  timestamp: string;
  context: {
    platform: string;
    version: string;
    userId?: string;
    sessionId?: string;
  };
  metadata?: {
    userAgent?: string;
    language?: string;
    timezone?: string;
    apiKey?: string; // 如需鉴权，放这里由 n8n 校验
  };
}

// 相关诗词接口
export interface RelatedPoem {
  title: string;
  author: string;
  excerpt: string;
  id: string;
}

// 响应数据接口
export interface ChatResponse {
  success: boolean;
  data?: {
    message: string;
    confidence?: number;
    suggestions?: string[];
    relatedPoems?: RelatedPoem[];
  };
  error?: string;
  metadata?: {
    processingTime: number;
    model: string;
    version: string;
  };
}

const defaultConfig: N8nWorkflowConfig = {
  webhookUrl: 'https://paean.app.n8n.cloud/webhook/poetry-analysis',
  apiKey: import.meta.env?.VITE_N8N_API_KEY,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};

export class N8nService {
  private config: N8nWorkflowConfig;

  constructor(config: Partial<N8nWorkflowConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.assertConfig();
  }

  private assertConfig() {
    if (!this.config.webhookUrl) {
      throw new Error('n8n工作流URL未配置，请检查环境变量设置');
    }
    if (this.config.timeout <= 0) {
      throw new Error('超时时间必须大于0');
    }
    if (this.config.retryAttempts < 0) {
      throw new Error('重试次数不能为负数');
    }
    if (this.config.retryDelay < 0) {
      throw new Error('重试延迟不能为负数');
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    // 如配置了 apiKey，注入到 body.metadata
    if (this.config.apiKey) {
      request = { ...request, metadata: { ...request.metadata, apiKey: this.config.apiKey } };
    }

    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await this.makeRequest(request);
      } catch (err) {
        lastError = err as Error;
        if (attempt < this.config.retryAttempts) {
          const wait = this.config.retryDelay * Math.pow(2, attempt - 1); // 指数退避 1x 2x 4x
          await this.delay(wait);
        }
      }
    }
    throw new Error(`n8n工作流服务不可用：${lastError?.message || '未知错误'}`);
  }

  private async makeRequest(request: ChatRequest): Promise<ChatResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // ⚠️ 不要设置 User-Agent；不要发送 Authorization（避免预检/CORS）
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await this.safeReadText(response);
        throw new Error(`HTTP ${response.status}: ${response.statusText}${errText ? ' - ' + errText : ''}`);
      }

      // 优先 JSON，失败回退文本；不依赖 content-length
      let parsed: unknown;
      try {
        // 先检查响应内容类型
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          parsed = await response.json();
        } else {
          // 如果不是 JSON，直接读取文本
          const txt = await response.text();
          parsed = this.tryParseJSON(txt) ?? (txt ? { message: txt } : {});
        }
      } catch (jsonError) {
        // JSON 解析失败，回退到文本
        try {
          const txt = await response.text();
          parsed = this.tryParseJSON(txt) ?? (txt ? { message: txt } : {});
        } catch (textError) {
          throw new Error(`响应解析失败: JSON错误=${jsonError}, 文本错误=${textError}`);
        }
      }

      // 兼容 {analysis: ...} 或 data.analysis
      if (parsed && typeof parsed === 'object' && parsed !== null) {
        const obj = parsed as Record<string, unknown>;
        if (!obj.message && obj.analysis) parsed = { ...obj, message: obj.analysis };
        if (!obj.message && obj.data && typeof obj.data === 'object' && obj.data !== null) {
          const dataObj = obj.data as Record<string, unknown>;
          if (dataObj.analysis) {
            parsed = { ...obj, data: { ...dataObj, message: dataObj.analysis } };
          }
        }
      }

      return this.validateResponse(parsed);

    } catch (error: unknown) {
      clearTimeout(timeoutId);

      // 标准化错误
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'DOMException') {
          throw new Error(`请求超时（${this.config.timeout}ms）`);
        }
        if (error instanceof TypeError) {
          // 浏览器中网络/CORS 失败常为 TypeError
          throw new Error('网络或跨域失败，请检查 CORS 设置与网络连通');
        }
        throw error;
      }
      throw new Error('未知错误');
    }
  }

  private validateResponse(data: unknown): ChatResponse {
    if (!data || (typeof data === 'object' && data !== null && Object.keys(data).length === 0)) {
      throw new Error('n8n工作流返回空响应');
    }

    if (typeof data === 'string') {
      return { success: true, data: { message: data } };
    }

    if (typeof data !== 'object' || data === null) {
      throw new Error('无效的响应格式');
    }

    const obj = data as Record<string, unknown>;

    if (obj.success === false) {
      throw new Error((obj.error as string) || '工作流执行失败');
    }

    // 标准格式
    if (obj.data && typeof obj.data === 'object' && obj.data !== null) {
      const dataObj = obj.data as Record<string, unknown>;
      if (!dataObj.message) throw new Error('响应中缺少消息内容');
      return {
        success: true,
        data: {
          message: dataObj.message as string,
          confidence: dataObj.confidence as number | undefined,
          suggestions: dataObj.suggestions as string[] | undefined,
          relatedPoems: dataObj.relatedPoems as RelatedPoem[] | undefined
        },
        metadata: obj.metadata as ChatResponse['metadata']
      };
    }

    // 简单格式
    if (typeof obj.message === 'string') {
      return {
        success: true,
        data: { message: obj.message },
        metadata: obj.metadata as ChatResponse['metadata']
      };
    }

    // 兜底键名
    const possible =
      (obj.text as string) ??
      (obj.content as string) ??
      (obj.reply as string) ??
      (obj.answer as string) ??
      (obj.response as string) ??
      (obj.analysis as string);
    if (typeof possible === 'string') {
      return { success: true, data: { message: possible } };
    }

    throw new Error('n8n工作流未返回有效响应，请检查工作流配置');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async safeReadText(res: Response): Promise<string> {
    try { return await res.text(); } catch { return ''; }
  }

  private tryParseJSON(text: string): unknown | null {
    try { return JSON.parse(text); } catch { return null; }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testRequest: ChatRequest = {
        message: '连接测试',
        timestamp: new Date().toISOString(),
        context: { platform: 'poetry-app', version: '1.0.0' },
        metadata: { language: 'zh-CN', timezone: 'Asia/Shanghai' }
      };
      await this.sendMessage(testRequest);
      return true;
    } catch {
      return false;
    }
  }

  updateConfig(config: Partial<N8nWorkflowConfig>): void {
    this.config = { ...this.config, ...config };
    this.assertConfig();
  }

  getConfig(): N8nWorkflowConfig {
    return { ...this.config };
  }
}

// 创建默认实例
export const n8nService = new N8nService();

// 便捷函数
export const sendToN8n = (message: string, context?: Record<string, unknown>): Promise<ChatResponse> => {
  const request: ChatRequest = {
    message,
    timestamp: new Date().toISOString(),
    context: { platform: 'poetry-app', version: '1.0.0', ...context }
  };
  return n8nService.sendMessage(request);
};

export const testN8nConnection = (): Promise<boolean> => n8nService.testConnection();
