// n8n工作流诊断脚本
// 在浏览器控制台中运行此脚本来诊断问题

async function diagnoseN8nWorkflow() {
  console.log('🔍 开始诊断n8n工作流...');

  const testCases = [
    {
      name: '基础连接测试',
      message: '连接测试',
      expected: '应该返回连接确认信息'
    },
    {
      name: '简单诗词查询',
      message: '推荐一首唐诗',
      expected: '应该返回诗词推荐'
    },
    {
      name: '诗人介绍查询',
      message: '李白介绍',
      expected: '应该返回李白的基本信息'
    },
    {
      name: '创作技巧查询',
      message: '诗词创作技巧',
      expected: '应该返回创作指导'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 测试: ${testCase.name}`);
    console.log(`输入: ${testCase.message}`);
    console.log(`期望: ${testCase.expected}`);

    try {
      const response = await fetch('https://paean.app.n8n.cloud/webhook/poetry-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          timestamp: new Date().toISOString(),
          context: {
            platform: 'poetry-app',
            version: '1.0.0'
          },
          metadata: {
            userAgent: 'diagnostic-script',
            language: 'zh-CN',
            timezone: 'Asia/Shanghai'
          }
        })
      });

      if (!response.ok) {
        console.error(`❌ HTTP错误: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      console.log('✅ 响应成功:', data);

      // 分析响应内容
      if (data.data && data.data.message) {
        const message = data.data.message;
        if (message.includes('抱歉') || message.includes('无法处理')) {
          console.warn('⚠️ 返回了默认错误消息，可能的原因:');
          console.warn('1. AI服务配置问题');
          console.warn('2. API密钥无效');
          console.warn('3. 工作流内部逻辑错误');
          console.warn('4. 网络连接问题');
        } else {
          console.log('✅ 返回了有效内容');
        }
      }

      // 检查调试信息
      if (data.data && data.data.debug) {
        console.log('🔧 调试信息:', data.data.debug);
      }

    } catch (error) {
      console.error(`❌ 请求失败:`, error);
    }
  }

  console.log('\n🏁 诊断完成');
  console.log('\n💡 建议检查项目:');
  console.log('1. n8n工作流是否已激活');
  console.log('2. AI服务（如OpenAI）的API密钥是否正确');
  console.log('3. 工作流内部节点配置是否正确');
  console.log('4. 网络连接是否正常');
  console.log('5. 查看n8n工作流的执行日志');
}

// 运行诊断
diagnoseN8nWorkflow();
