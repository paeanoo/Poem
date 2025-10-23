import type { Poem, SearchParams } from '@/types'
import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_POETRY_API as string | undefined

// 数据库诗词类型定义
type DatabasePoem = {
  id: number
  title: string
  author_id: number
  dynasty_id: number | null
  content: string[]
  tags: string[] | null
  category: string | null
  difficulty_level: number
  popularity_score: number
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
  poets: {
    name: string
    dynasty_id: number | null
    birth_year: number | null
    death_year: number | null
    biography: string | null
    style: string | null
    avatar: string | null
  }
  dynasties: {
    name: string
    start_year: number | null
    end_year: number | null
    description: string | null
  }
}

// 转换数据库数据为前端格式
function transformDatabasePoem(dbPoem: DatabasePoem): Poem {
  return {
    id: dbPoem.id.toString(),
    title: dbPoem.title,
    author: dbPoem.poets.name,
    dynasty: dbPoem.dynasties.name,
    content: dbPoem.content,
    tags: dbPoem.tags || [],
    createdAt: dbPoem.created_at.slice(0, 10),
    updatedAt: dbPoem.updated_at.slice(0, 10),
  }
}

// 从数据库获取诗词数据
async function fetchFromDatabase(params?: SearchParams): Promise<Poem[]> {
  try {
    let query = supabase
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

    // 应用搜索条件
    if (params?.keyword) {
      // 使用全文搜索
      query = query.or(`title.ilike.%${params.keyword}%,content.cs.{${params.keyword}}`)
    }

    if (params?.author) {
      query = query.eq('poets.name', params.author)
    }

    if (params?.dynasty) {
      query = query.eq('dynasties.name', params.dynasty)
    }

    // 按热度排序
    query = query.order('popularity_score', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('数据库查询错误:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('未找到诗词数据，返回空数组')
      return []
    }

    return data.map(transformDatabasePoem)
  } catch (error) {
    console.error('从数据库获取诗词数据失败:', error)
    throw error
  }
}

// 备用本地数据（仅在数据库连接失败时使用）
async function fetchLocal(): Promise<Poem[]> {
  console.warn('使用本地备用数据')
  const samplePoems = [
    {
      id: '1',
      title: '静夜思',
      author: '李白',
      dynasty: '唐',
      content: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
      tags: ['思乡', '月亮', '夜晚'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '2',
      title: '春晓',
      author: '孟浩然',
      dynasty: '唐',
      content: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
      tags: ['春天', '自然', '感慨'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    // 李白作品
    {
      id: '3',
      title: '将进酒',
      author: '李白',
      dynasty: '唐',
      content: [
        '君不见，黄河之水天上来，奔流到海不复回。',
        '君不见，高堂明镜悲白发，朝如青丝暮成雪。',
        '人生得意须尽欢，莫使金樽空对月。',
        '天生我材必有用，千金散尽还复来。',
        '烹羊宰牛且为乐，会须一饮三百杯。',
        '岑夫子，丹丘生，将进酒，杯莫停。',
        '与君歌一曲，请君为我倾耳听。',
        '钟鼓馔玉不足贵，但愿长醉不复醒。',
        '古来圣贤皆寂寞，惟有饮者留其名。',
        '陈王昔时宴平乐，斗酒十千恣欢谑。',
        '主人何为言少钱，径须沽取对君酌。',
        '五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。'
      ],
      tags: ['豪放', '饮酒', '人生'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '4',
      title: '蜀道难',
      author: '李白',
      dynasty: '唐',
      content: [
        '噫吁嚱，危乎高哉！蜀道之难，难于上青天！',
        '蚕丛及鱼凫，开国何茫然！',
        '尔来四万八千岁，不与秦塞通人烟。',
        '西当太白有鸟道，可以横绝峨眉巅。',
        '地崩山摧壮士死，然后天梯石栈相钩连。',
        '上有六龙回日之高标，下有冲波逆折之回川。',
        '黄鹤之飞尚不得过，猿猱欲度愁攀援。',
        '青泥何盘盘，百步九折萦岩峦。',
        '扪参历井仰胁息，以手抚膺坐长叹。',
        '问君西游何时还？畏途巉岩不可攀。',
        '但见悲鸟号古木，雄飞雌从绕林间。',
        '又闻子规啼夜月，愁空山。',
        '蜀道之难，难于上青天，使人听此凋朱颜！'
      ],
      tags: ['山水', '豪放', '蜀道'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '5',
      title: '早发白帝城',
      author: '李白',
      dynasty: '唐',
      content: [
        '朝辞白帝彩云间',
        '千里江陵一日还',
        '两岸猿声啼不住',
        '轻舟已过万重山'
      ],
      tags: ['山水', '行旅', '三峡'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    // 杜甫作品
    {
      id: '6',
      title: '春望',
      author: '杜甫',
      dynasty: '唐',
      content: [
        '国破山河在',
        '城春草木深',
        '感时花溅泪',
        '恨别鸟惊心',
        '烽火连三月',
        '家书抵万金',
        '白头搔更短',
        '浑欲不胜簪'
      ],
      tags: ['忧国', '思家', '战争'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '7',
      title: '茅屋为秋风所破歌',
      author: '杜甫',
      dynasty: '唐',
      content: [
        '八月秋高风怒号，卷我屋上三重茅。',
        '茅飞渡江洒江郊，高者挂罥长林梢，下者飘转沉塘坳。',
        '南村群童欺我老无力，忍能对面为盗贼。',
        '公然抱茅入竹去，唇焦口燥呼不得，归来倚杖自叹息。',
        '俄顷风定云墨色，秋天漠漠向昏黑。',
        '布衾多年冷似铁，娇儿恶卧踏里裂。',
        '床头屋漏无干处，雨脚如麻未断绝。',
        '自经丧乱少睡眠，长夜沾湿何由彻！',
        '安得广厦千万间，大庇天下寒士俱欢颜！',
        '风雨不动安如山。呜呼！何时眼前突兀见此屋，吾庐独破受冻死亦足！'
      ],
      tags: ['忧民', '贫困', '理想'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '8',
      title: '登高',
      author: '杜甫',
      dynasty: '唐',
      content: [
        '风急天高猿啸哀',
        '渚清沙白鸟飞回',
        '无边落木萧萧下',
        '不尽长江滚滚来',
        '万里悲秋常作客',
        '百年多病独登台',
        '艰难苦恨繁霜鬓',
        '潦倒新停浊酒杯'
      ],
      tags: ['登高', '悲秋', '思乡'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    // 苏轼作品
    {
      id: '9',
      title: '念奴娇·赤壁怀古',
      author: '苏轼',
      dynasty: '宋',
      content: [
        '大江东去，浪淘尽，千古风流人物。',
        '故垒西边，人道是，三国周郎赤壁。',
        '乱石穿空，惊涛拍岸，卷起千堆雪。',
        '江山如画，一时多少豪杰。',
        '遥想公瑾当年，小乔初嫁了，雄姿英发。',
        '羽扇纶巾，谈笑间，樯橹灰飞烟灭。',
        '故国神游，多情应笑我，早生华发。',
        '人生如梦，一尊还酹江月。'
      ],
      tags: ['怀古', '豪放', '赤壁'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '10',
      title: '水调歌头·明月几时有',
      author: '苏轼',
      dynasty: '宋',
      content: [
        '明月几时有？把酒问青天。',
        '不知天上宫阙，今夕是何年。',
        '我欲乘风归去，又恐琼楼玉宇，',
        '高处不胜寒。',
        '起舞弄清影，何似在人间。',
        '转朱阁，低绮户，照无眠。',
        '不应有恨，何事长向别时圆？',
        '人有悲欢离合，月有阴晴圆缺，',
        '此事古难全。',
        '但愿人长久，千里共婵娟。'
      ],
      tags: ['中秋', '思亲', '哲理'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '11',
      title: '江城子·密州出猎',
      author: '苏轼',
      dynasty: '宋',
      content: [
        '老夫聊发少年狂，左牵黄，右擎苍，',
        '锦帽貂裘，千骑卷平冈。',
        '为报倾城随太守，亲射虎，看孙郎。',
        '酒酣胸胆尚开张，鬓微霜，又何妨！',
        '持节云中，何日遣冯唐？',
        '会挽雕弓如满月，西北望，射天狼。'
      ],
      tags: ['出猎', '豪放', '报国'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    // 更多唐诗作品
    {
      id: '12',
      title: '望庐山瀑布',
      author: '李白',
      dynasty: '唐',
      content: [
        '日照香炉生紫烟',
        '遥看瀑布挂前川',
        '飞流直下三千尺',
        '疑是银河落九天'
      ],
      tags: ['山水', '瀑布', '庐山'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '13',
      title: '赠汪伦',
      author: '李白',
      dynasty: '唐',
      content: [
        '李白乘舟将欲行',
        '忽闻岸上踏歌声',
        '桃花潭水深千尺',
        '不及汪伦送我情'
      ],
      tags: ['友情', '离别', '桃花潭'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '14',
      title: '望岳',
      author: '杜甫',
      dynasty: '唐',
      content: [
        '岱宗夫如何？齐鲁青未了。',
        '造化钟神秀，阴阳割昏晓。',
        '荡胸生曾云，决眦入归鸟。',
        '会当凌绝顶，一览众山小。'
      ],
      tags: ['山水', '泰山', '豪情'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '15',
      title: '春夜喜雨',
      author: '杜甫',
      dynasty: '唐',
      content: [
        '好雨知时节，当春乃发生。',
        '随风潜入夜，润物细无声。',
        '野径云俱黑，江船火独明。',
        '晓看红湿处，花重锦官城。'
      ],
      tags: ['春天', '雨', '自然'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '16',
      title: '山居秋暝',
      author: '王维',
      dynasty: '唐',
      content: [
        '空山新雨后，天气晚来秋。',
        '明月松间照，清泉石上流。',
        '竹喧归浣女，莲动下渔舟。',
        '随意春芳歇，王孙自可留。'
      ],
      tags: ['山水', '秋天', '隐居'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '17',
      title: '相思',
      author: '王维',
      dynasty: '唐',
      content: [
        '红豆生南国',
        '春来发几枝',
        '愿君多采撷',
        '此物最相思'
      ],
      tags: ['相思', '红豆', '爱情'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    // 更多宋词作品
    {
      id: '18',
      title: '声声慢·寻寻觅觅',
      author: '李清照',
      dynasty: '宋',
      content: [
        '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。',
        '乍暖还寒时候，最难将息。',
        '三杯两盏淡酒，怎敌他、晚来风急？',
        '雁过也，正伤心，却是旧时相识。',
        '满地黄花堆积，憔悴损，如今有谁堪摘？',
        '守着窗儿，独自怎生得黑？',
        '梧桐更兼细雨，到黄昏、点点滴滴。',
        '这次第，怎一个愁字了得！'
      ],
      tags: ['婉约', '愁思', '孤独'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '19',
      title: '如梦令·常记溪亭日暮',
      author: '李清照',
      dynasty: '宋',
      content: [
        '常记溪亭日暮，沉醉不知归路。',
        '兴尽晚回舟，误入藕花深处。',
        '争渡，争渡，惊起一滩鸥鹭。'
      ],
      tags: ['回忆', '溪亭', '荷花'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '20',
      title: '破阵子·为陈同甫赋壮词以寄之',
      author: '辛弃疾',
      dynasty: '宋',
      content: [
        '醉里挑灯看剑，梦回吹角连营。',
        '八百里分麾下炙，五十弦翻塞外声。',
        '沙场秋点兵。',
        '马作的卢飞快，弓如霹雳弦惊。',
        '了却君王天下事，赢得生前身后名。',
        '可怜白发生！'
      ],
      tags: ['豪放', '壮志', '战场'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '21',
      title: '青玉案·元夕',
      author: '辛弃疾',
      dynasty: '宋',
      content: [
        '东风夜放花千树，更吹落、星如雨。',
        '宝马雕车香满路。',
        '凤箫声动，玉壶光转，一夜鱼龙舞。',
        '蛾儿雪柳黄金缕，笑语盈盈暗香去。',
        '众里寻他千百度，蓦然回首，',
        '那人却在，灯火阑珊处。'
      ],
      tags: ['元宵', '寻人', '灯火'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '22',
      title: '雨霖铃·寒蝉凄切',
      author: '柳永',
      dynasty: '宋',
      content: [
        '寒蝉凄切，对长亭晚，骤雨初歇。',
        '都门帐饮无绪，留恋处，兰舟催发。',
        '执手相看泪眼，竟无语凝噎。',
        '念去去，千里烟波，暮霭沉沉楚天阔。',
        '多情自古伤离别，更那堪，冷落清秋节！',
        '今宵酒醒何处？杨柳岸，晓风残月。',
        '此去经年，应是良辰好景虚设。',
        '便纵有千种风情，更与何人说？'
      ],
      tags: ['离别', '秋天', '柳永'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    // 元曲作品
    {
      id: '23',
      title: '天净沙·秋思',
      author: '马致远',
      dynasty: '元',
      content: [
        '枯藤老树昏鸦',
        '小桥流水人家',
        '古道西风瘦马',
        '夕阳西下',
        '断肠人在天涯'
      ],
      tags: ['秋天', '思乡', '孤独'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '24',
      title: '山坡羊·潼关怀古',
      author: '张养浩',
      dynasty: '元',
      content: [
        '峰峦如聚，波涛如怒，山河表里潼关路。',
        '望西都，意踌躇。',
        '伤心秦汉经行处，宫阙万间都做了土。',
        '兴，百姓苦；亡，百姓苦。'
      ],
      tags: ['怀古', '潼关', '民生'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '25',
      title: '沉醉东风·渔夫',
      author: '白朴',
      dynasty: '元',
      content: [
        '黄芦岸白蘋渡口，绿杨堤红蓼滩头。',
        '虽无刎颈交，却有忘机友，',
        '点秋江白鹭沙鸥。',
        '傲杀人间万户侯，不识字烟波钓叟。'
      ],
      tags: ['渔夫', '隐居', '自由'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '26',
      title: '四块玉·闲适',
      author: '关汉卿',
      dynasty: '元',
      content: [
        '南亩耕，东山卧，世态人情经历多。',
        '闲将往事思量过。',
        '贤的是他，愚的是我，争什么？'
      ],
      tags: ['闲适', '人生', '哲理'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: '27',
      title: '窦娥冤·滚绣球',
      author: '关汉卿',
      dynasty: '元',
      content: [
        '有日月朝暮悬，有鬼神掌着生死权。',
        '天地也！只合把清浊分辨，',
        '可怎生糊突了盗跖、颜渊？',
        '为善的受贫穷更命短，',
        '造恶的享富贵又寿延。',
        '天地也！做得个怕硬欺软，',
        '却原来也这般顺水推船！',
        '地也，你不分好歹何为地！',
        '天也，你错勘贤愚枉做天！',
        '哎，只落得两泪涟涟。'
      ],
      tags: ['窦娥冤', '关汉卿', '元曲', '悲剧'],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
  ]
  return samplePoems
}

// 远程API获取诗词数据（保留原有功能）
export async function fetchPoemsRemote(params?: SearchParams): Promise<Poem[]> {
  // If no API configured, throw to trigger fallback
  if (!API_BASE) throw new Error('no api configured')

  const url = new URL('/poems', API_BASE)
  if (params?.keyword) url.searchParams.set('q', params.keyword)
  if (params?.author) url.searchParams.set('author', params.author)
  if (params?.dynasty) url.searchParams.set('dynasty', params.dynasty)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`remote ${res.status}`)
  const data = (await res.json()) as unknown[]

  // 转换远程API数据格式
  return data.map((item: unknown) => {
    const typedItem = item as Record<string, unknown>
    return {
      id: (typedItem.id as string)?.toString() ?? `${typedItem.title as string}-${typedItem.author as string}`,
      title: typedItem.title as string,
      author: typedItem.author as string,
      dynasty: (typedItem.dynasty as string) ?? '',
      content: Array.isArray(typedItem.content) ? typedItem.content as string[] :
               (typeof typedItem.content === 'string' ? (typedItem.content as string).split('\n') : []),
      tags: (typedItem.tags as string[]) ?? [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
  })
}

// 主要获取诗词数据的方法（优先使用数据库）
export async function getPoems(params?: SearchParams): Promise<Poem[]> {
  // 临时解决方案：部署环境强制使用本地数据
  if (import.meta.env.PROD) {
    console.warn('生产环境：使用本地备用数据')
    const localData = await fetchLocal()

    // 如果有搜索参数，进行本地过滤
    if (params) {
      let result = localData
      if (params.keyword) {
        const k = params.keyword.toLowerCase()
        result = result.filter(p =>
          p.title.toLowerCase().includes(k) ||
          p.author.toLowerCase().includes(k) ||
          p.content.some(l => l.toLowerCase().includes(k))
        )
      }
      if (params.author) {
        result = result.filter(p => p.author.toLowerCase().includes(params.author!.toLowerCase()))
      }
      if (params.dynasty) {
        result = result.filter(p => p.dynasty === params.dynasty)
      }
      return result
    }

    return localData
  }

  try {
    // 开发环境：优先从数据库获取
    return await fetchFromDatabase(params)
  } catch (dbError) {
    console.warn('数据库获取失败，尝试远程API:', dbError)
    try {
      // 尝试远程API
      return await fetchPoemsRemote(params)
    } catch (apiError) {
      console.warn('远程API获取失败，使用本地数据:', apiError)
      // 最后使用本地备用数据
      const localData = await fetchLocal()

      // 如果有搜索参数，进行本地过滤
      if (params) {
        let result = localData
        if (params.keyword) {
          const k = params.keyword.toLowerCase()
          result = result.filter(p =>
            p.title.toLowerCase().includes(k) ||
            p.author.toLowerCase().includes(k) ||
            p.content.some(l => l.toLowerCase().includes(k))
          )
        }
        if (params.author) {
          result = result.filter(p => p.author.toLowerCase().includes(params.author!.toLowerCase()))
        }
        if (params.dynasty) {
          result = result.filter(p => p.dynasty === params.dynasty)
        }
        return result
      }

      return localData
    }
  }
}

// 根据ID获取单个诗词
export async function getPoemById(id: string): Promise<Poem | null> {
  try {
    const { data, error } = await supabase
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
      .eq('id', parseInt(id))
      .single()

    if (error) {
      console.error('获取诗词详情失败:', error)
      return null
    }

    if (!data) {
      return null
    }

    return transformDatabasePoem(data)
  } catch (error) {
    console.error('获取诗词详情时发生错误:', error)
    return null
  }
}

// 搜索诗词（使用数据库全文搜索）
export async function searchPoems(params: SearchParams): Promise<Poem[]> {
  try {
    // 首先尝试从数据库获取
    return await fetchFromDatabase(params)
  } catch (error) {
    console.warn('数据库搜索失败，使用本地搜索:', error)
    // 降级到本地搜索
    const list = await fetchLocal()
    let result = list

    if (params.keyword) {
      const k = params.keyword.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(k) ||
        p.author.toLowerCase().includes(k) ||
        p.content.some(l => l.toLowerCase().includes(k))
      )
    }
    if (params.author) {
      result = result.filter(p => p.author.toLowerCase().includes(params.author!.toLowerCase()))
    }
    if (params.dynasty) {
      result = result.filter(p => p.dynasty === params.dynasty)
    }

    console.log(`本地搜索找到 ${result.length} 首诗词`)
    return result
  }
}

// 获取热门诗词
export async function getPopularPoems(limit: number = 10): Promise<Poem[]> {
  try {
    // 按照指定顺序获取热门诗词：静夜思、春晓、水调歌头、将进酒、破阵子、声声慢
    const orderedTitles = [
      '静夜思',
      '春晓',
      '水调歌头·明月几时有',
      '将进酒',
      '破阵子·为陈同甫赋壮词以寄之',
      '声声慢'
    ]

    const { data, error } = await supabase
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
      .in('title', orderedTitles)

    if (error) {
      console.error('获取热门诗词失败:', error)
      return []
    }

    if (!data || data.length === 0) {
      console.warn('未找到指定顺序的诗词，使用默认排序')
      // 如果找不到指定诗词，回退到原来的排序方式
      const { data: fallbackData, error: fallbackError } = await supabase
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
        .order('popularity_score', { ascending: false })
        .order('like_count', { ascending: false })
        .limit(limit)

      if (fallbackError) {
        console.error('获取备用热门诗词失败:', fallbackError)
        return []
      }

      return fallbackData.map(transformDatabasePoem)
    }

    // 按照指定顺序重新排列结果
    const orderedData = orderedTitles
      .map(title => data.find(poem => poem.title === title))
      .filter(poem => poem !== undefined)
      .slice(0, limit)

    return orderedData.map(transformDatabasePoem)
  } catch (error) {
    console.error('获取热门诗词时发生错误:', error)
    return []
  }
}

// 获取诗人信息
export async function getPoetInfo(poetName: string) {
  try {
    const { data, error } = await supabase
      .from('poets')
      .select(`
        id,
        name,
        dynasty_id,
        birth_year,
        death_year,
        biography,
        style,
        representative_works,
        avatar,
        dynasties!inner(name, start_year, end_year, description)
      `)
      .eq('name', poetName)
      .single()

    if (error) {
      console.error('获取诗人信息失败:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('获取诗人信息时发生错误:', error)
    return null
  }
}

// 获取朝代信息
export async function getDynastyInfo(dynastyName: string) {
  try {
    const { data, error } = await supabase
      .from('dynasties')
      .select('*')
      .eq('name', dynastyName)
      .single()

    if (error) {
      console.error('获取朝代信息失败:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('获取朝代信息时发生错误:', error)
    return null
  }
}


