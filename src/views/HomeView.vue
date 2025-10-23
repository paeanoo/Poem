<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePoemStore } from '@/stores/poem';
import * as PoetryService from '@/services/poetry';
import { handleAvatarError } from '@/utils/avatarUtils';
import AiChatAssistant from '@/components/chat/AiChatAssistant.vue';

// 状态管理
const router = useRouter();

// 热门诗词推荐
const hotPoems = ref<{ title: string; author: string; dynasty?: string; excerpt: string; image: string; id: string }[]>([]);

// 加载热门诗词
const loadHotPoems = async () => {
  try {
    // 优先使用getPopularPoems方法获取热门诗词
    const list = await PoetryService.getPopularPoems(6);
    hotPoems.value = list.map((p, idx) => ({
      id: p.id,
      title: p.title,
      author: p.author,
      dynasty: p.dynasty,
      excerpt: p.content.slice(0, 4).join('\n'),
      image: [
        'https://ai-public.mastergo.com/ai/img_res/8677cddd3f0c7f7a0d32c3dee650cb8d.jpg',
        'https://ai-public.mastergo.com/ai/img_res/6b6e61661d2253c75c313cc63c5b76cf.jpg',
        'https://ai-public.mastergo.com/ai/img_res/0c11e79fb281ece1012244495299476e.jpg',
        'https://ai-public.mastergo.com/ai/img_res/d34749196cfc2826de5f2f07fe2cb79a.jpg',
        'https://ai-public.mastergo.com/ai/img_res/4523c49c729013fd127bd26518ad4940.jpg',
        'https://ai-public.mastergo.com/ai/img_res/a0587ab694073b7efa3ca42a84bc6133.jpg',
      ][idx % 6],
    }));
  } catch (error) {
    console.error('加载热门诗词失败:', error);
    // 如果热门诗词加载失败，使用备用数据
    try {
      const fallbackList = await PoetryService.getPoems();
      hotPoems.value = fallbackList.slice(0, 6).map((p, idx) => ({
        id: p.id,
        title: p.title,
        author: p.author,
        dynasty: p.dynasty,
        excerpt: p.content.slice(0, 4).join('\n'),
        image: [
          'https://ai-public.mastergo.com/ai/img_res/8677cddd3f0c7f7a0d32c3dee650cb8d.jpg',
          'https://ai-public.mastergo.com/ai/img_res/6b6e61661d2253c75c313cc63c5b76cf.jpg',
          'https://ai-public.mastergo.com/ai/img_res/0c11e79fb281ece1012244495299476e.jpg',
          'https://ai-public.mastergo.com/ai/img_res/d34749196cfc2826de5f2f07fe2cb79a.jpg',
          'https://ai-public.mastergo.com/ai/img_res/4523c49c729013fd127bd26518ad4940.jpg',
          'https://ai-public.mastergo.com/ai/img_res/a0587ab694073b7efa3ca42a84bc6133.jpg',
        ][idx % 6],
      }));
    } catch (fallbackError) {
      console.error('备用数据加载也失败:', fallbackError);
    }
  }
};

// 处理图片加载失败
const handleImageError = (event: Event) => {
  handleAvatarError(event);
};

onMounted(async () => {
  await loadHotPoems();
});

// Categories Data - 保留三个主要分类，使用新的本地图片
const categories = ref([
  {
    name: "唐诗",
    image: "/images/categories/tang-poetry.png",
    description: "唐代诗歌，中国诗歌的黄金时代"
  },
  {
    name: "宋词",
    image: "/images/categories/song-ci.png",
    description: "宋代词作，婉约与豪放并存"
  },
  {
    name: "元曲",
    image: "/images/categories/yuan-qu.png",
    description: "元代散曲和杂剧，通俗文学的代表"
  }
]);

// Famous Poets Data
const famousPoets = ref([
  {
    name: "李白",
    dynasty: "唐代",
    bio: "字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为'诗仙'。",
    avatar: "/images/poets/li-bai.jpg",
    works: ["将进酒", "蜀道难", "早发白帝城"]
  },
  {
    name: "杜甫",
    dynasty: "唐代",
    bio: "字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人称为'诗圣'。",
    avatar: "/images/poets/du-fu.jpg",
    works: ["春望", "茅屋为秋风所破歌", "登高"]
  },
  {
    name: "苏轼",
    dynasty: "宋代",
    bio: "字子瞻，号东坡居士，北宋著名文学家、书画家，豪放派词人代表。",
    avatar: "/images/poets/su-shi.jpg",
    works: ["念奴娇·赤壁怀古", "水调歌头·明月几时有", "江城子·密州出猎"]
  }
]);

// Community Posts Data
const communityPosts = ref([
  {
    author: "墨香书生",
    time: "2小时前",
    content: "新作《秋思》：枫叶飘零满径黄，西风瑟瑟透心凉。思君不见君何处，唯有明月照空床。",
    avatar: "https://ai-public.mastergo.com/ai/img_res/0c4b445fafc506c9ee9035859ae21770.jpg",
    likes: 24,
    comments: 8
  },
  {
    author: "诗韵雅音",
    time: "5小时前",
    content: "读李白《将进酒》有感：人生得意须尽欢，莫使金樽空对月。古来圣贤皆寂寞，惟有饮者留其名。",
    avatar: "https://ai-public.mastergo.com/ai/img_res/29305598ac33dabe6421504efeeda494.jpg",
    likes: 42,
    comments: 15
  },
  {
    author: "山水清音",
    time: "1天前",
    content: "原创《山居吟》：青山如黛水如琴，白鹭翩翩入翠林。最爱夕阳西下处，炊烟袅袅绕山村。",
    avatar: "https://ai-public.mastergo.com/ai/img_res/fc1b7064e6e7e935e08d46f04826eb29.jpg",
    likes: 67,
    comments: 23
  }
]);

// Discussion Topics Data
const discussionTopics = ref([
  {
    title: "如何理解'诗中有画，画中有诗'？",
    excerpt: "王维的诗作常被人评价为'诗中有画'，这种艺术境界是如何实现的？",
    replies: 32,
    lastReply: "1小时前"
  },
  {
    title: "宋词中的婉约派与豪放派各有什么特色？",
    excerpt: "以李清照和苏轼为例，探讨婉约派与豪放派在风格和表现手法上的差异。",
    replies: 45,
    lastReply: "3小时前"
  },
  {
    title: "现代诗歌如何传承古典诗词的意境？",
    excerpt: "当代诗人在创作中如何汲取古典诗词的营养，又如何体现时代特色？",
    replies: 28,
    lastReply: "昨天"
  }
]);

// 工具函数
const normalizeCategory = (name: string) => {
  if (!name) return name;
  const first = name.charAt(0);
  return first;
};


const goto = (name: string, params?: Record<string, string | number>, query?: Record<string, string | number | string[]>) => {
  router.push({ name, params, query });
};

const onHotPoemClick = async (poem: { id: string; title: string }) => {
  router.push({ name: 'poem-detail', params: { id: poem.id } });
};

</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">

    <!-- Hero Banner -->
    <section class="relative h-[500px] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
      <img
        src="https://ai-public.mastergo.com/ai/img_res/aac3852c2ae0b54c6ca5e72627929389.jpg"
        alt="Hero Banner"
        class="w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 z-20 flex items-center pl-20">
        <div class="max-w-2xl text-white">
          <h2 class="text-5xl font-bold mb-4">品读千年诗词之美</h2>
          <p class="text-xl mb-8 leading-relaxed">
            在这里，您可以欣赏到从唐诗宋词到现代诗歌的精华之作，感受中华文化的深厚底蕴与无穷魅力。
          </p>
          <button class="!rounded-button whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white py-3 px-8 text-lg font-medium transition-colors" @click="goto('community')">
            开始探索
          </button>
        </div>
      </div>
    </section>



    <!-- Hot Poetry Recommendations -->
    <section class="py-16 px-8 bg-gray-50 text-gray-900">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold mb-10 text-center text-gray-900">热门诗词推荐</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(poem, index) in hotPoems"
            :key="index"
            class="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            @click="onHotPoemClick(poem)"
          >
            <img
              :src="poem.image"
              :alt="poem.title"
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-bold">{{ poem.title }}</h3>
              </div>
              <p class="text-gray-600 mb-2">{{ poem.author }} · {{ poem.dynasty }}</p>
              <div class="text-gray-700 whitespace-pre-line">{{ poem.excerpt }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Poetry Categories -->
    <section class="py-12 bg-gray-100">
      <div class="max-w-7xl mx-auto px-8">
        <h2 class="text-3xl font-bold mb-8 text-center">诗词分类</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            @click="goto('category', { name: normalizeCategory(category.name) })"
          >
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-6 text-center">
              <h3 class="text-2xl font-semibold mb-2">{{ category.name }}</h3>
              <p class="text-gray-600 text-sm">{{ category.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Famous Poets -->
    <section class="py-16 px-8">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold mb-10 text-center">名家作品</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div
            v-for="(poet, index) in famousPoets"
            :key="index"
            class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
          >
            <img
              :src="poet.avatar"
              :alt="poet.name"
              class="w-24 h-24 rounded-full object-cover mb-4 border-4 border-amber-100"
              @error="handleImageError"
            />
            <h3 class="text-2xl font-bold mb-2">{{ poet.name }}</h3>
            <p class="text-gray-600 mb-4">{{ poet.dynasty }}</p>
            <p class="text-gray-700 mb-6">{{ poet.bio }}</p>
            <div class="w-full">
              <h4 class="text-lg font-semibold mb-3">代表作品</h4>
              <ul class="space-y-2">
                <li
                  v-for="(work, idx) in poet.works"
                  :key="idx"
                  class="text-amber-700 hover:text-amber-800 cursor-pointer"
                  @click.stop="goto('search', {}, { q: work })"
                >
                  {{ work }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Section -->
    <section class="py-16 bg-gray-100">
      <div class="max-w-7xl mx-auto px-8">
        <h2 class="text-3xl font-bold mb-10 text-center">诗词社区</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">最新创作</h3>
            <div
              v-for="(post, index) in communityPosts"
              :key="index"
              class="border-b border-gray-200 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
            >
              <div class="flex items-start mb-2">
                <img
                  :src="post.avatar"
                  :alt="post.author"
                  class="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 class="font-semibold">{{ post.author }}</h4>
                  <p class="text-gray-500 text-sm">{{ post.time }}</p>
                </div>
              </div>
              <p class="text-gray-700 mb-2">{{ post.content }}</p>
              <div class="flex space-x-4 text-gray-500">
                <button class="flex items-center space-x-1 hover:text-amber-600">
                  <i class="fas fa-thumbs-up"></i>
                  <span>{{ post.likes }}</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-amber-600">
                  <i class="fas fa-comment"></i>
                  <span>{{ post.comments }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold mb-4">热门讨论</h3>
            <div class="space-y-4">
              <div
                v-for="(topic, index) in discussionTopics"
                :key="index"
                class="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors cursor-pointer"
              >
                <h4 class="font-bold mb-2">{{ topic.title }}</h4>
                <p class="text-gray-600 text-sm mb-3">{{ topic.excerpt }}</p>
                <div class="flex justify-between text-gray-500 text-sm">
                  <span>{{ topic.replies }} 回复</span>
                  <span>{{ topic.lastReply }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI聊天助手 -->
    <AiChatAssistant />

  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
