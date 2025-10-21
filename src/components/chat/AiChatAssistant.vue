<template>
  <div class="ai-chat-assistant">
    <!-- 悬浮按钮 -->
    <div
      v-if="!isOpen"
      class="fixed bottom-6 right-6 z-50"
      @click="toggleChat"
    >
      <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center group relative overflow-hidden">
        <!-- 小机器人头像 -->
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 rounded-full group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM6 12H8V14H6V12ZM16 12H18V14H16V12ZM12 15C13.1 15 14 15.9 14 17V19C14 20.1 13.1 21 12 21C10.9 21 10 20.1 10 19V17C10 15.9 10.9 15 12 15Z"/>
          </svg>
        </div>
        <!-- 新消息提示点 -->
        <div
          v-if="hasNewMessage"
          class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"
        ></div>
        <!-- 呼吸动画 -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-ping opacity-20"></div>
      </div>
      <!-- 提示文字 -->
      <div class="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        AI诗词助手
        <div class="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <div
      v-if="isOpen"
      class="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up flex flex-col"
    >
      <!-- 聊天头部 -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            <!-- 小机器人头像 -->
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM6 12H8V14H6V12ZM16 12H18V14H16V12ZM12 15C13.1 15 14 15.9 14 17V19C14 20.1 13.1 21 12 21C10.9 21 10 20.1 10 19V17C10 15.9 10.9 15 12 15Z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold">AI诗词助手</h3>
            <p class="text-sm opacity-90">智能诗词顾问</p>
          </div>
        </div>
        <button
          @click="toggleChat"
          class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <!-- 关闭叉号图标 -->
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 消息列表 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="flex animate-fade-in"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div
            class="max-w-[80%] rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105"
            :class="message.role === 'user'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 shadow-sm'"
          >
            <div class="whitespace-pre-wrap">{{ message.content }}</div>
            <div class="text-xs opacity-70 mt-1">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex justify-start animate-fade-in">
          <div class="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%] shadow-sm">
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
              <span class="text-sm text-gray-500">AI正在思考...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="border-t border-gray-200 p-4 flex-shrink-0">
        <div class="flex space-x-2">
          <input
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            placeholder="输入您的问题..."
            class="flex-1 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 bg-white"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isLoading"
            class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <!-- 向上箭头发送图标 -->
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>

        <!-- 快捷问题 -->
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="quickQuestion in quickQuestions"
            :key="quickQuestion"
            @click="sendQuickQuestion(quickQuestion)"
            class="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            :disabled="isLoading"
          >
            {{ quickQuestion }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useChatStore } from '@/stores/chat';

// 状态管理
const chatStore = useChatStore();

// 响应式数据
const isOpen = ref(false);
const inputMessage = ref('');
const isLoading = ref(false);
const hasNewMessage = ref(false);

// 快捷问题
const quickQuestions = ref([
  '推荐经典诗词',
  '李白介绍',
  '诗词创作技巧',
  '意境解析',
  '杜甫介绍',
  '苏轼介绍'
]);

// 消息容器引用
const messagesContainer = ref<HTMLElement>();

// 计算属性
const messages = computed(() => chatStore.messages);

// 方法
const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    hasNewMessage.value = false;
    nextTick(() => {
      scrollToBottom();
    });
  }
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = inputMessage.value.trim();
  inputMessage.value = '';

  // 添加用户消息
  chatStore.addMessage({
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  });

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  // 发送到AI
  isLoading.value = true;
  try {
    const response = await chatStore.sendToAI(userMessage);

    // 添加AI回复
    chatStore.addMessage({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    // 显示新消息提示
    if (!isOpen.value) {
      hasNewMessage.value = true;
    }

  } catch (error) {
    console.error('n8n工作流请求失败:', error);

    // 提供更友好的错误信息
    let errorMessage = '抱歉，AI助手暂时无法处理您的请求。';
    if (error instanceof Error) {
      if (error.message.includes('超时')) {
        errorMessage = '请求超时，请检查网络连接或稍后重试。';
      } else if (error.message.includes('网络连接失败')) {
        errorMessage = '网络连接失败，请检查网络设置。';
      } else if (error.message.includes('CORS')) {
        errorMessage = '跨域请求被阻止，请联系技术支持。';
      } else if (error.message.includes('工作流配置') || error.message.includes('AI服务配置')) {
        errorMessage = 'AI服务配置问题，请确保服务已正确设置。';
      } else if (error.message.includes('未返回有效响应') || error.message.includes('返回空响应') || error.message.includes('AI服务暂时不可用')) {
        errorMessage = 'AI服务暂时不可用，请稍后重试。';
      } else if (error.message.includes('AI服务')) {
        errorMessage = `AI服务错误：${error.message}`;
      } else {
        errorMessage = `AI服务连接错误：${error.message}`;
      }
    }

    chatStore.addMessage({
      role: 'assistant',
      content: errorMessage,
      timestamp: new Date()
    });
    // 同时在控制台打印最后一条后端原始响应，便于排查
    console.warn('AI错误提示：', errorMessage);
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const sendQuickQuestion = (question: string) => {
  inputMessage.value = question;
  sendMessage();
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 生命周期
onMounted(() => {
  // 初始化聊天历史
  chatStore.loadChatHistory();

  // 如果没有聊天历史，显示欢迎消息
  if (chatStore.messages.length === 0) {
    chatStore.addMessage({
      role: 'assistant',
      content: '您好！我是完全基于n8n工作流的AI诗词助手，专门帮助您学习和欣赏诗词。\n\n我可以为您提供：\n- 经典诗词推荐\n- 诗人背景介绍\n- 诗词创作指导\n- 意境深度解析\n\n所有回复都通过n8n工作流处理，确保智能化和准确性。请告诉我您想了解什么！',
      timestamp: new Date()
    });
  }
});

onUnmounted(() => {
  // 保存聊天历史
  chatStore.saveChatHistory();
});
</script>

<style scoped>
.ai-chat-assistant {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 自定义动画 */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* 自定义滚动条 */
.ai-chat-assistant ::-webkit-scrollbar {
  width: 4px;
}

.ai-chat-assistant ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.ai-chat-assistant ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.ai-chat-assistant ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .ai-chat-assistant .fixed {
    right: 1rem !important;
    bottom: 1rem !important;
    width: calc(100vw - 2rem) !important;
    max-width: 400px !important;
  }
}

/* 消息气泡动画 */
.message-bubble {
  transition: all 0.3s ease;
}

.message-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 输入框焦点效果 */
.input-focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 按钮点击效果 */
.button-click {
  transform: scale(0.95);
}
</style>
