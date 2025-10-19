<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">n8n连接测试</h1>

      <!-- 配置信息 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">当前配置</h2>
        <div class="space-y-2">
          <p><strong>Webhook URL:</strong> {{ config.webhookUrl }}</p>
          <p><strong>超时时间:</strong> {{ config.timeout }}ms</p>
          <p><strong>重试次数:</strong> {{ config.retryAttempts }}</p>
        </div>
      </div>

      <!-- 连接测试 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">连接测试</h2>
        <div class="flex space-x-4 mb-4">
          <button
            @click="testConnection"
            :disabled="isTesting"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isTesting ? '测试中...' : '测试连接' }}
          </button>
          <button
            @click="diagnoseWorkflow"
            :disabled="isTesting"
            class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            诊断工作流
          </button>
        </div>

        <div v-if="testResult" class="mt-4 p-4 rounded" :class="testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <p><strong>结果:</strong> {{ testResult.message }}</p>
          <p v-if="testResult.responseTime"><strong>响应时间:</strong> {{ testResult.responseTime }}ms</p>
          <div v-if="testResult.details" class="mt-2 text-sm">
            <p><strong>详细信息:</strong></p>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{{ testResult.details }}</pre>
          </div>
        </div>
      </div>

      <!-- 消息测试 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">消息测试</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">测试消息:</label>
            <input
              v-model="testMessage"
              type="text"
              placeholder="输入测试消息..."
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            @click="sendTestMessage"
            :disabled="isSending || !testMessage.trim()"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {{ isSending ? '发送中...' : '发送测试消息' }}
          </button>

          <div v-if="messageResult" class="mt-4 p-4 rounded" :class="messageResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            <p><strong>结果:</strong> {{ messageResult.success ? '成功' : '失败' }}</p>
            <p v-if="messageResult.response"><strong>响应:</strong> {{ messageResult.response }}</p>
            <p v-if="messageResult.error"><strong>错误:</strong> {{ messageResult.error }}</p>
          </div>
        </div>
      </div>

      <!-- 快捷测试按钮 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">快捷测试</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="quickTest in quickTests"
            :key="quickTest"
            @click="testMessage = quickTest; sendTestMessage()"
            :disabled="isSending"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            {{ quickTest }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { n8nService } from '@/services/n8n';

// 响应式数据
const config = ref(n8nService.getConfig());
const isTesting = ref(false);
const isSending = ref(false);
const testResult = ref<{
  success: boolean;
  message: string;
  responseTime?: number;
  details?: string;
} | null>(null);
const messageResult = ref<{
  success: boolean;
  response?: string;
  error?: string;
} | null>(null);
const testMessage = ref('推荐一首唐诗');

// 快捷测试消息
const quickTests = ref([
  '推荐一首唐诗',
  '李白介绍',
  '诗词创作技巧',
  '意境解析',
  '连接测试',
  '工作流状态检查'
]);

// 测试连接
const testConnection = async () => {
  isTesting.value = true;
  testResult.value = null;

  try {
    const success = await n8nService.testConnection();
    testResult.value = {
      success,
      message: success ? 'n8n工作流连接正常' : 'n8n工作流连接失败，AI服务不可用'
    };
  } catch (error) {
    testResult.value = {
      success: false,
      message: `测试失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  } finally {
    isTesting.value = false;
  }
};

// 诊断工作流
const diagnoseWorkflow = async () => {
  isTesting.value = true;
  testResult.value = null;

  try {
    console.log('🔍 开始诊断n8n工作流...');

    // 发送诊断请求
    const response = await n8nService.sendMessage({
      message: '工作流状态检查',
      timestamp: new Date().toISOString(),
      context: {
        platform: 'poetry-app',
        version: '1.0.0'
      },
      metadata: {
        userAgent: 'diagnostic-client',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai'
      }
    });

    testResult.value = {
      success: true,
      message: 'n8n工作流诊断完成',
      details: JSON.stringify(response, null, 2)
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    testResult.value = {
      success: false,
      message: `诊断失败: ${errorMessage}`,
      details: `错误类型: ${error instanceof Error ? error.constructor.name : 'Unknown'}\n错误信息: ${errorMessage}\n\n建议检查:\n1. n8n工作流是否正确配置\n2. 工作流是否已激活\n3. webhook URL是否正确\n4. 工作流是否能够处理请求`
    };
  } finally {
    isTesting.value = false;
  }
};

// 发送测试消息
const sendTestMessage = async () => {
  if (!testMessage.value.trim()) return;

  isSending.value = true;
  messageResult.value = null;

  try {
    const response = await n8nService.sendMessage({
      message: testMessage.value,
      timestamp: new Date().toISOString(),
      context: {
        platform: 'poetry-app',
        version: '1.0.0'
      },
      metadata: {
        userAgent: 'test-client',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai'
      }
    });

    messageResult.value = {
      success: true,
      response: response.data?.message || '无响应内容'
    };
  } catch (error) {
    messageResult.value = {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  } finally {
    isSending.value = false;
  }
};

onMounted(() => {
  // 自动测试连接
  testConnection();
});
</script>
