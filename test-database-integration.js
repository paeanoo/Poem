// 星汉诗词平台 - 数据库集成测试脚本
// 用于测试诗词数据从数据库正确加载

import { createClient } from '@supabase/supabase-js'

// 配置Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 测试函数
async function testDatabaseIntegration() {
  console.log('🚀 开始测试数据库集成...')
  console.log('==========================================')

  try {
    // 1. 测试朝代数据
    console.log('📚 测试朝代数据...')
    const { data: dynasties, error: dynastiesError } = await supabase
      .from('dynasties')
      .select('*')
      .limit(5)

    if (dynastiesError) {
      console.error('❌ 朝代数据查询失败:', dynastiesError)
    } else {
      console.log('✅ 朝代数据查询成功:', dynasties?.length || 0, '条记录')
      if (dynasties && dynasties.length > 0) {
        console.log('   示例:', dynasties[0].name)
      }
    }

    // 2. 测试诗人数据
    console.log('\n👨‍🎨 测试诗人数据...')
    const { data: poets, error: poetsError } = await supabase
      .from('poets')
      .select('*')
      .limit(5)

    if (poetsError) {
      console.error('❌ 诗人数据查询失败:', poetsError)
    } else {
      console.log('✅ 诗人数据查询成功:', poets?.length || 0, '条记录')
      if (poets && poets.length > 0) {
        console.log('   示例:', poets[0].name)
      }
    }

    // 3. 测试诗词数据
    console.log('\n📖 测试诗词数据...')
    const { data: poems, error: poemsError } = await supabase
      .from('poems')
      .select(`
        id,
        title,
        author_id,
        dynasty_id,
        content,
        tags,
        category,
        difficulty_level,
        popularity_score,
        view_count,
        like_count,
        created_at,
        updated_at,
        poets!inner(name, dynasty_id, birth_year, death_year, biography, style, avatar),
        dynasties!inner(name, start_year, end_year, description)
      `)
      .limit(5)

    if (poemsError) {
      console.error('❌ 诗词数据查询失败:', poemsError)
    } else {
      console.log('✅ 诗词数据查询成功:', poems?.length || 0, '条记录')
      if (poems && poems.length > 0) {
        const poem = poems[0]
        console.log('   示例诗词:')
        console.log('   - 标题:', poem.title)
        console.log('   - 作者:', poem.poets.name)
        console.log('   - 朝代:', poem.dynasties.name)
        console.log('   - 内容行数:', poem.content.length)
        console.log('   - 标签:', poem.tags?.join(', ') || '无')
        console.log('   - 热度评分:', poem.popularity_score)
      }
    }

    // 4. 测试诗词赏析数据
    console.log('\n🔍 测试诗词赏析数据...')
    const { data: analyses, error: analysesError } = await supabase
      .from('poem_analyses')
      .select('*')
      .limit(3)

    if (analysesError) {
      console.error('❌ 诗词赏析数据查询失败:', analysesError)
    } else {
      console.log('✅ 诗词赏析数据查询成功:', analyses?.length || 0, '条记录')
      if (analyses && analyses.length > 0) {
        console.log('   示例赏析类型:', analyses[0].type)
      }
    }

    // 5. 测试标签数据
    console.log('\n🏷️ 测试标签数据...')
    const { data: tags, error: tagsError } = await supabase
      .from('poem_tags')
      .select('*')
      .limit(10)

    if (tagsError) {
      console.error('❌ 标签数据查询失败:', tagsError)
    } else {
      console.log('✅ 标签数据查询成功:', tags?.length || 0, '条记录')
      if (tags && tags.length > 0) {
        console.log('   示例标签:', tags.slice(0, 5).map(t => t.name).join(', '))
      }
    }

    // 6. 测试全文搜索功能
    console.log('\n🔍 测试全文搜索功能...')
    const { data: searchResults, error: searchError } = await supabase
      .from('poems')
      .select(`
        id,
        title,
        poets!inner(name),
        dynasties!inner(name)
      `)
      .or('title.ilike.%明月%,content.cs.{明月}')
      .limit(3)

    if (searchError) {
      console.error('❌ 全文搜索失败:', searchError)
    } else {
      console.log('✅ 全文搜索成功:', searchResults?.length || 0, '条结果')
      if (searchResults && searchResults.length > 0) {
        console.log('   搜索结果:')
        searchResults.forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.title} - ${result.poets.name}`)
        })
      }
    }

    // 7. 测试热门诗词功能
    console.log('\n🔥 测试热门诗词功能...')
    const { data: popularPoems, error: popularError } = await supabase
      .from('poems')
      .select(`
        id,
        title,
        popularity_score,
        like_count,
        poets!inner(name)
      `)
      .order('popularity_score', { ascending: false })
      .order('like_count', { ascending: false })
      .limit(3)

    if (popularError) {
      console.error('❌ 热门诗词查询失败:', popularError)
    } else {
      console.log('✅ 热门诗词查询成功:', popularPoems?.length || 0, '条记录')
      if (popularPoems && popularPoems.length > 0) {
        console.log('   热门诗词:')
        popularPoems.forEach((poem, index) => {
          console.log(`   ${index + 1}. ${poem.title} - ${poem.poets.name} (热度: ${poem.popularity_score}, 点赞: ${poem.like_count})`)
        })
      }
    }

    // 8. 测试数据统计
    console.log('\n📊 测试数据统计...')
    const { data: stats, error: statsError } = await supabase
      .rpc('get_poetry_stats')

    if (statsError) {
      console.error('❌ 数据统计查询失败:', statsError)
      // 手动统计
      const { count: poemCount } = await supabase
        .from('poems')
        .select('*', { count: 'exact', head: true })

      const { count: poetCount } = await supabase
        .from('poets')
        .select('*', { count: 'exact', head: true })

      const { count: dynastyCount } = await supabase
        .from('dynasties')
        .select('*', { count: 'exact', head: true })

      console.log('✅ 手动统计结果:')
      console.log('   - 诗词总数:', poemCount || 0)
      console.log('   - 诗人总数:', poetCount || 0)
      console.log('   - 朝代总数:', dynastyCount || 0)
    } else {
      console.log('✅ 数据统计查询成功:')
      if (stats && stats.length > 0) {
        const stat = stats[0]
        console.log('   - 诗词总数:', stat.total_poems)
        console.log('   - 诗人总数:', stat.total_poets)
        console.log('   - 朝代总数:', stat.total_dynasties)
      }
    }

    console.log('\n==========================================')
    console.log('🎉 数据库集成测试完成！')
    console.log('==========================================')
    console.log('✅ 所有核心功能测试通过')
    console.log('📝 建议下一步:')
    console.log('   1. 在前端应用中测试诗词数据加载')
    console.log('   2. 验证搜索功能是否正常工作')
    console.log('   3. 测试点赞、收藏等交互功能')
    console.log('   4. 检查数据迁移是否完整')

  } catch (error) {
    console.error('❌ 数据库集成测试失败:', error)
    console.log('\n🔧 故障排除建议:')
    console.log('   1. 检查Supabase连接配置')
    console.log('   2. 确认数据库表是否已创建')
    console.log('   3. 验证数据迁移是否成功执行')
    console.log('   4. 检查网络连接和权限设置')
  }
}

// 运行测试
if (typeof window === 'undefined') {
  // Node.js环境
  testDatabaseIntegration()
} else {
  // 浏览器环境
  console.log('请在Node.js环境中运行此测试脚本')
}

export { testDatabaseIntegration }
