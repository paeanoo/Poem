import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { n8nService, type ChatRequest, type ChatResponse } from '@/services/n8n';

// 消息接口
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// n8n工作流配置
interface N8nWorkflowConfig {
  webhookUrl: string;
  apiKey?: string;
  timeout: number;
}

export const useChatStore = defineStore('chat', () => {
  // 状态
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // n8n工作流配置 - 完全使用指定的n8n工作流
  const n8nConfig = ref<N8nWorkflowConfig>({
    webhookUrl: 'https://paean.app.n8n.cloud/webhook/poetry-analysis',
    apiKey: import.meta.env.VITE_N8N_API_KEY,
    timeout: 30000 // 30秒超时
  });

  // 计算属性
  const hasMessages = computed(() => messages.value.length > 0);
  const lastMessage = computed(() => messages.value[messages.value.length - 1]);

  // 方法
  const addMessage = (message: ChatMessage) => {
    messages.value.push(message);
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const sendToAI = async (userMessage: string): Promise<string> => {
    isLoading.value = true;
    error.value = null;

    try {
      // 构建请求数据
      const requestData: ChatRequest = {
        message: userMessage,
        timestamp: new Date().toISOString(),
        context: {
          platform: 'poetry-app',
          version: '1.0.0'
        }
      };

      console.log('🚀 发送请求到n8n工作流:', {
        webhookUrl: n8nConfig.value.webhookUrl,
        message: userMessage,
        requestData
      });

      // 使用n8n服务发送请求（完全依赖远程工作流）
      const response: ChatResponse = await n8nService.sendMessage(requestData);

      console.log('📥 收到n8n工作流响应:', response);

      // 处理响应
      if (response.success && response.data && response.data.message) {
        return response.data.message;
      } else {
        throw new Error(response.error || 'n8n工作流服务暂时不可用');
      }

    } catch (err) {
      console.error('❌ n8n工作流请求失败:', err);

      // 提供更详细的错误信息（完全依赖n8n工作流）
      let errorMessage = 'n8n工作流服务暂时不可用，请稍后重试。';
      if (err instanceof Error) {
        if (err.message.includes('超时')) {
          errorMessage = 'n8n工作流请求超时，请检查网络连接或稍后重试。';
        } else if (err.message.includes('网络连接失败')) {
          errorMessage = '网络连接失败，请检查网络设置。';
        } else if (err.message.includes('CORS')) {
          errorMessage = '跨域请求被阻止，请联系技术支持。';
        } else if (err.message.includes('工作流配置')) {
          errorMessage = 'n8n工作流配置问题，请确保工作流已正确设置并能够响应请求。';
        } else if (err.message.includes('未返回有效响应')) {
          errorMessage = 'n8n工作流未返回有效响应，请检查工作流是否正确配置并能够处理请求。';
        } else {
          errorMessage = `n8n工作流错误：${err.message}`;
        }
      }

      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };


  // 本地存储管理
  const saveChatHistory = () => {
    try {
      const chatData = {
        messages: messages.value.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('poetry-ai-chat', JSON.stringify(chatData));
    } catch (err) {
      console.error('保存聊天历史失败:', err);
    }
  };

  const loadChatHistory = () => {
    try {
      const saved = localStorage.getItem('poetry-ai-chat');
      if (saved) {
        const chatData = JSON.parse(saved);
        messages.value = chatData.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (err) {
      console.error('加载聊天历史失败:', err);
    }
  };

  const clearChatHistory = () => {
    try {
      localStorage.removeItem('poetry-ai-chat');
      messages.value = [];
    } catch (err) {
      console.error('清除聊天历史失败:', err);
    }
  };

  // 更新n8n配置
  const updateN8nConfig = (config: Partial<N8nWorkflowConfig>) => {
    n8nConfig.value = { ...n8nConfig.value, ...config };
  };

  // 测试n8n连接
  const testN8nConnection = async (): Promise<boolean> => {
    return await n8nService.testConnection();
  };

  return {
    // 状态
    messages,
    isLoading,
    error,
    n8nConfig,

    // 计算属性
    hasMessages,
    lastMessage,

    // 方法
    addMessage,
    clearMessages,
    sendToAI,
    saveChatHistory,
    loadChatHistory,
    clearChatHistory,
    updateN8nConfig,
    testN8nConnection
  };
});
