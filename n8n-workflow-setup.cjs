#!/usr/bin/env node

/**
 * n8n工作流配置检查工具
 * 帮助诊断和配置n8n工作流连接问题
 */

const https = require('https');

// 配置信息
const config = {
  webhookUrl: 'https://paean.app.n8n.cloud/webhook/poetry-analysis',
  timeout: 10000
};

// 测试请求数据
const testData = {
  message: "工作流连接测试",
  timestamp: new Date().toISOString(),
  context: {
    platform: "poetry-app",
    version: "1.0.0"
  }
};

/**
 * 测试n8n工作流连接
 */
async function testN8nConnection() {
  console.log('🔍 开始测试n8n工作流连接...\n');
  console.log('📍 Webhook URL:', config.webhookUrl);
  console.log('⏱️  超时时间:', config.timeout + 'ms\n');

  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify(testData);
    
    const url = new URL(config.webhookUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'User-Agent': 'Poetry-AI-Chat/1.0.0'
      },
      timeout: config.timeout
    };

    const req = https.request(options, (res) => {
      console.log('📥 HTTP响应状态:', res.statusCode, res.statusMessage);
      console.log('📥 响应头:', JSON.stringify(res.headers, null, 2));

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📥 响应内容:', data);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ n8n工作流连接正常');
          resolve({
            success: true,
            statusCode: res.statusCode,
            data: data
          });
        } else {
          console.log('❌ n8n工作流响应异常');
          resolve({
            success: false,
            statusCode: res.statusCode,
            error: `HTTP ${res.statusCode}: ${data}`
          });
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 请求失败:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('⏰ 请求超时');
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(requestData);
    req.end();
  });
}

/**
 * 诊断连接问题
 */
function diagnoseConnection(result) {
  console.log('\n🔧 连接问题诊断:');
  
  if (result.success) {
    console.log('✅ 连接正常，工作流配置正确');
    return;
  }

  if (result.statusCode === 404) {
    console.log('❌ Webhook路径不存在，请检查：');
    console.log('   1. n8n工作流是否已发布');
    console.log('   2. Webhook URL是否正确');
    console.log('   3. 工作流是否激活');
  } else if (result.statusCode === 401 || result.statusCode === 403) {
    console.log('❌ 认证失败，请检查：');
    console.log('   1. API密钥是否正确配置');
    console.log('   2. 工作流认证设置');
  } else if (result.statusCode === 500) {
    console.log('❌ 服务器内部错误，请检查：');
    console.log('   1. n8n工作流日志');
    console.log('   2. 工作流节点配置');
  } else {
    console.log('❌ 未知错误，建议：');
    console.log('   1. 检查网络连接');
    console.log('   2. 验证n8n服务状态');
    console.log('   3. 查看浏览器控制台错误');
  }
}

/**
 * 提供解决方案
 */
function provideSolutions() {
  console.log('\n🚀 解决方案建议:');
  
  console.log('\n📋 方案一：使用内置测试工具');
  console.log('   1. 访问 http://localhost:5173/n8n-test');
  console.log('   2. 运行连接测试和诊断');
  console.log('   3. 根据错误信息调整配置');

  console.log('\n🌐 方案二：配置自己的n8n服务');
  console.log('   1. 部署n8n实例（Docker或云服务）');
  console.log('   2. 创建诗词AI工作流');
  console.log('   3. 更新.env文件中的Webhook URL');

  console.log('\n🔧 方案三：检查当前配置');
  console.log('   1. 确认.env文件存在且配置正确');
  console.log('   2. 检查VITE_N8N_WEBHOOK_URL环境变量');
  console.log('   3. 验证网络连接和防火墙设置');

  console.log('\n💡 快速配置示例:');
  console.log('   // .env文件');
  console.log('   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/poetry-analysis');
  console.log('   VITE_N8N_API_KEY=your-api-key-here');
}

// 执行测试
async function main() {
  try {
    const result = await testN8nConnection();
    diagnoseConnection(result);
  } catch (error) {
    console.log('❌ 测试失败:', error.message);
    diagnoseConnection({ success: false, error: error.message });
  }
  
  provideSolutions();
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { testN8nConnection, diagnoseConnection, provideSolutions };