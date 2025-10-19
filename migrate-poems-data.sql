-- 星汉诗词平台 - 数据迁移脚本
-- 将前端硬编码的诗词数据迁移到PostgreSQL数据库
-- 执行前请确保已执行 poetry-database-schema.sql

-- ============================================
-- 1. 插入诗人数据
-- ============================================
INSERT INTO public.poets (name, dynasty_id, birth_year, death_year, biography, style, representative_works, avatar) VALUES
('李白', (SELECT id FROM public.dynasties WHERE name = '唐'), 701, 762, 
 '字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。', 
 '豪放飘逸，想象丰富，语言流转自然，音律和谐多变',
 ARRAY['静夜思', '将进酒', '蜀道难', '早发白帝城'],
 'du-fu.jpg'),
('孟浩然', (SELECT id FROM public.dynasties WHERE name = '唐'), 689, 740,
 '唐代著名的山水田园诗人，与王维并称"王孟"。',
 '清淡自然，意境优美，语言简练',
 ARRAY['春晓', '过故人庄', '宿建德江'],
 'li-bai.jpg'),
('苏轼', (SELECT id FROM public.dynasties WHERE name = '宋'), 1037, 1101,
 '字子瞻，号东坡居士，北宋文学家、书法家、画家，豪放派词人代表。',
 '豪放旷达，清新豪健，善用夸张比喻',
 ARRAY['水调歌头·明月几时有', '念奴娇·赤壁怀古', '江城子·密州出猎'],
 'su-shi.jpg')
ON CONFLICT (name, dynasty_id) DO NOTHING;

-- ============================================
-- 2. 插入诗词数据
-- ============================================
-- 静夜思
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('静夜思', 
 (SELECT id FROM public.poets WHERE name = '李白' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '唐')),
 (SELECT id FROM public.dynasties WHERE name = '唐'),
 ARRAY['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
 ARRAY['思乡', '月亮', '夜晚'],
 '唐诗', 1, 95);

-- 春晓
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('春晓',
 (SELECT id FROM public.poets WHERE name = '孟浩然' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '唐')),
 (SELECT id FROM public.dynasties WHERE name = '唐'),
 ARRAY['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
 ARRAY['春天', '自然', '感慨'],
 '唐诗', 1, 90);

-- 水调歌头·明月几时有
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('水调歌头·明月几时有',
 (SELECT id FROM public.poets WHERE name = '苏轼' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '宋')),
 (SELECT id FROM public.dynasties WHERE name = '宋'),
 ARRAY[
   '明月几时有？',
   '把酒问青天。',
   '不知天上宫阙，',
   '今夕是何年。',
   '我欲乘风归去，',
   '又恐琼楼玉宇，',
   '高处不胜寒。',
   '起舞弄清影，',
   '何似在人间。',
   '转朱阁，',
   '低绮户，',
   '照无眠。',
   '不应有恨，',
   '何事长向别时圆？',
   '人有悲欢离合，',
   '月有阴晴圆缺，',
   '此事古难全。',
   '但愿人长久，',
   '千里共婵娟。'
 ],
 ARRAY['明月', '哲思', '豪放'],
 '宋词', 3, 98);

-- 将进酒
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('将进酒',
 (SELECT id FROM public.poets WHERE name = '李白' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '唐')),
 (SELECT id FROM public.dynasties WHERE name = '唐'),
 ARRAY[
   '君不见黄河之水天上来，',
   '奔流到海不复回。',
   '君不见高堂明镜悲白发，',
   '朝如青丝暮成雪。',
   '人生得意须尽欢，',
   '莫使金樽空对月。',
   '天生我材必有用，',
   '千金散尽还复来。',
   '烹羊宰牛且为乐，',
   '会须一饮三百杯。',
   '岑夫子，',
   '丹丘生，',
   '将进酒，',
   '杯莫停。',
   '与君歌一曲，',
   '请君为我倾耳听。',
   '钟鼓馔玉不足贵，',
   '但愿长醉不复醒。',
   '古来圣贤皆寂寞，',
   '惟有饮者留其名。',
   '陈王昔时宴平乐，',
   '斗酒十千恣欢谑。',
   '主人何为言少钱，',
   '径须沽取对君酌。',
   '五花马，',
   '千金裘，',
   '呼儿将出换美酒，',
   '与尔同销万古愁。'
 ],
 ARRAY['豪放', '饮酒', '人生'],
 '唐诗', 4, 99);

-- 蜀道难
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('蜀道难',
 (SELECT id FROM public.poets WHERE name = '李白' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '唐')),
 (SELECT id FROM public.dynasties WHERE name = '唐'),
 ARRAY[
   '噫吁嚱，危乎高哉！',
   '蜀道之难，难于上青天！',
   '蚕丛及鱼凫，',
   '开国何茫然！',
   '尔来四万八千岁，',
   '不与秦塞通人烟。',
   '西当太白有鸟道，',
   '可以横绝峨眉巅。',
   '地崩山摧壮士死，',
   '然后天梯石栈相钩连。',
   '上有六龙回日之高标，',
   '下有冲波逆折之回川。',
   '黄鹤之飞尚不得过，',
   '猿猱欲度愁攀援。',
   '青泥何盘盘，',
   '百步九折萦岩峦。',
   '扪参历井仰胁息，',
   '以手抚膺坐长叹。',
   '问君西游何时还？',
   '畏途巉岩不可攀。',
   '但见悲鸟号古木，',
   '雄飞雌从绕林间。',
   '又闻子规啼夜月，',
   '愁空山。',
   '蜀道之难，难于上青天，',
   '使人听此凋朱颜！',
   '连峰去天不盈尺，',
   '枯松倒挂倚绝壁。',
   '飞湍瀑流争喧豗，',
   '砯崖转石万壑雷。',
   '其险也如此，',
   '嗟尔远道之人胡为乎来哉！',
   '剑阁峥嵘而崔嵬，',
   '一夫当关，万夫莫开。',
   '所守或匪亲，',
   '化为狼与豺。',
   '朝避猛虎，',
   '夕避长蛇；',
   '磨牙吮血，',
   '杀人如麻。',
   '锦城虽云乐，',
   '不如早还家。',
   '蜀道之难，难于上青天，',
   '侧身西望长咨嗟。'
 ],
 ARRAY['山川', '险阻', '豪放'],
 '唐诗', 5, 97);

-- 早发白帝城
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('早发白帝城',
 (SELECT id FROM public.poets WHERE name = '李白' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '唐')),
 (SELECT id FROM public.dynasties WHERE name = '唐'),
 ARRAY['朝辞白帝彩云间', '千里江陵一日还', '两岸猿声啼不住', '轻舟已过万重山'],
 ARRAY['山水', '行旅'],
 '唐诗', 2, 88);

-- ============================================
-- 3. 添加更多诗人数据
-- ============================================
INSERT INTO public.poets (name, dynasty_id, birth_year, death_year, biography, style, representative_works, avatar) VALUES
('杜甫', (SELECT id FROM public.dynasties WHERE name = '唐'), 712, 770,
 '字子美，号少陵野老，唐代伟大的现实主义诗人，被后人誉为"诗圣"。',
 '沉郁顿挫，忧国忧民，语言精练，意境深远',
 ARRAY['春望', '登高', '茅屋为秋风所破歌', '三吏三别'],
 'du-fu.jpg'),
('王维', (SELECT id FROM public.dynasties WHERE name = '唐'), 701, 761,
 '字摩诘，号摩诘居士，唐代著名诗人、画家，山水田园诗派代表。',
 '诗中有画，画中有诗，意境优美，语言清新',
 ARRAY['山居秋暝', '鸟鸣涧', '鹿柴', '送元二使安西'],
 'wang-wei.jpg'),
('李清照', (SELECT id FROM public.dynasties WHERE name = '宋'), 1084, 1155,
 '号易安居士，宋代著名女词人，婉约词派代表。',
 '婉约细腻，情感真挚，语言优美，意境深远',
 ARRAY['声声慢', '如梦令', '醉花阴', '一剪梅'],
 'li-qingzhao.jpg'),
('辛弃疾', (SELECT id FROM public.dynasties WHERE name = '宋'), 1140, 1207,
 '字幼安，号稼轩，南宋豪放派词人，与苏轼并称"苏辛"。',
 '豪放激昂，爱国情怀，语言雄浑，气势磅礴',
 ARRAY['破阵子', '永遇乐', '青玉案', '水龙吟'],
 'xin-qiji.jpg'),
('关汉卿', (SELECT id FROM public.dynasties WHERE name = '元'), 1234, 1300,
 '元代著名戏曲家，元曲四大家之一。',
 '通俗易懂，情节生动，语言幽默，讽刺深刻',
 ARRAY['窦娥冤', '救风尘', '望江亭', '单刀会'],
 'guan-hanqing.jpg')
ON CONFLICT (name, dynasty_id) DO NOTHING;

-- ============================================
-- 4. 添加更多诗词数据
-- ============================================
-- 杜甫 - 春望
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('春望',
 (SELECT id FROM public.poets WHERE name = '杜甫' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '唐')),
 (SELECT id FROM public.dynasties WHERE name = '唐'),
 ARRAY['国破山河在', '城春草木深', '感时花溅泪', '恨别鸟惊心', '烽火连三月', '家书抵万金', '白头搔更短', '浑欲不胜簪'],
 ARRAY['忧国', '思乡', '战争'],
 '律诗', 3, 92);

-- 王维 - 山居秋暝
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('山居秋暝',
 (SELECT id FROM public.poets WHERE name = '王维' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '唐')),
 (SELECT id FROM public.dynasties WHERE name = '唐'),
 ARRAY['空山新雨后', '天气晚来秋', '明月松间照', '清泉石上流', '竹喧归浣女', '莲动下渔舟', '随意春芳歇', '王孙自可留'],
 ARRAY['山水', '田园', '秋天'],
 '律诗', 2, 89);

-- 李清照 - 声声慢
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('声声慢',
 (SELECT id FROM public.poets WHERE name = '李清照' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '宋')),
 (SELECT id FROM public.dynasties WHERE name = '宋'),
 ARRAY[
   '寻寻觅觅，',
   '冷冷清清，',
   '凄凄惨惨戚戚。',
   '乍暖还寒时候，',
   '最难将息。',
   '三杯两盏淡酒，',
   '怎敌他、晚来风急？',
   '雁过也，',
   '正伤心，',
   '却是旧时相识。',
   '满地黄花堆积，',
   '憔悴损，',
   '如今有谁堪摘？',
   '守着窗儿，',
   '独自怎生得黑？',
   '梧桐更兼细雨，',
   '到黄昏、点点滴滴。',
   '这次第，',
   '怎一个愁字了得！'
 ],
 ARRAY['愁思', '秋天', '孤独'],
 '宋词', 4, 94);

-- 辛弃疾 - 破阵子
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('破阵子·为陈同甫赋壮词以寄之',
 (SELECT id FROM public.poets WHERE name = '辛弃疾' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '宋')),
 (SELECT id FROM public.dynasties WHERE name = '宋'),
 ARRAY[
   '醉里挑灯看剑，',
   '梦回吹角连营。',
   '八百里分麾下炙，',
   '五十弦翻塞外声，',
   '沙场秋点兵。',
   '马作的卢飞快，',
   '弓如霹雳弦惊。',
   '了却君王天下事，',
   '赢得生前身后名。',
   '可怜白发生！'
 ],
 ARRAY['豪放', '战争', '壮志'],
 '宋词', 4, 96);

-- 关汉卿 - 窦娥冤（节选）
INSERT INTO public.poems (title, author_id, dynasty_id, content, tags, category, difficulty_level, popularity_score) VALUES
('窦娥冤·滚绣球',
 (SELECT id FROM public.poets WHERE name = '关汉卿' AND dynasty_id = (SELECT id FROM public.dynasties WHERE name = '元')),
 (SELECT id FROM public.dynasties WHERE name = '元'),
 ARRAY[
   '有日月朝暮悬，',
   '有鬼神掌着生死权。',
   '天地也！',
   '只合把清浊分辨，',
   '可怎生糊突了盗跖、颜渊？',
   '为善的受贫穷更命短，',
   '造恶的享富贵又寿延。',
   '天地也！',
   '做得个怕硬欺软，',
   '却原来也这般顺水推船！',
   '地也，你不分好歹何为地！',
   '天也，你错勘贤愚枉做天！',
   '哎，只落得两泪涟涟。'
 ],
 ARRAY['愤怒', '不公', '控诉'],
 '元曲', 5, 91);

-- ============================================
-- 5. 插入诗词赏析数据
-- ============================================
-- 静夜思赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '静夜思'),
 'basic',
 '此诗写于李白客居他乡之时，表达了诗人对故乡的深深思念。',
 '思乡之情',
 ARRAY['对比', '比喻', '直抒胸臆'],
 ARRAY['思念', '孤独', '怀旧'],
 ARRAY['明月', '霜', '故乡'],
 '明亮的月光洒在床前，我以为是地上的霜。抬头仰望明月，低头思念故乡。',
 '这首诗语言简洁，意境深远。诗人通过"明月光"和"地上霜"的对比，营造出清冷的氛围，表达了深深的思乡之情。全诗四句，每句都紧扣主题，是思乡诗的经典之作。');

-- 春晓赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '春晓'),
 'basic',
 '孟浩然隐居鹿门山时所作，描写春天早晨的景色。',
 '对春天的喜爱和对时光流逝的感慨',
 ARRAY['听觉描写', '对比', '设问'],
 ARRAY['喜爱', '感慨', '珍惜'],
 ARRAY['春眠', '啼鸟', '风雨', '落花'],
 '春天睡醒不觉天已亮，到处听到鸟儿的啼叫声。昨夜的风雨声，不知吹落了多少花朵。',
 '这首诗以听觉为主要描写手法，通过"闻啼鸟"和"风雨声"的对比，生动地描绘了春天的早晨。最后一句"花落知多少"既是对昨夜风雨的回忆，也暗含对时光流逝的感慨。');

-- 水调歌头赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '水调歌头·明月几时有'),
 'advanced',
 '苏轼在密州任知州时，中秋夜思念弟弟苏辙而作。',
 '对人生的思考和对亲人的思念',
 ARRAY['想象', '对比', '哲理思辨'],
 ARRAY['思念', '豁达', '哲理'],
 ARRAY['明月', '青天', '宫阙', '人间'],
 '明月什么时候开始有的？我端着酒杯问青天。不知道天上的宫殿，今晚是哪一年。我想乘着风回到天上，又担心琼楼玉宇太高，受不了那里的寒冷。起舞弄清影，哪里比得上在人间？',
 '这首词是苏轼的代表作之一，体现了其豪放旷达的个性。词人通过对明月的追问，表达了对人生和宇宙的思考。下阕从天上回到人间，体现了苏轼的豁达人生观。全词意境开阔，哲理深刻，是中秋词的经典之作。');

-- ============================================
-- 4. 建立诗词标签关联
-- ============================================
-- 静夜思标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '静夜思'), (SELECT id FROM public.poem_tags WHERE name = '思乡')),
((SELECT id FROM public.poems WHERE title = '静夜思'), (SELECT id FROM public.poem_tags WHERE name = '月亮'));

-- 春晓标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '春晓'), (SELECT id FROM public.poem_tags WHERE name = '春天')),
((SELECT id FROM public.poems WHERE title = '春晓'), (SELECT id FROM public.poem_tags WHERE name = '自然'));

-- 水调歌头标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '水调歌头·明月几时有'), (SELECT id FROM public.poem_tags WHERE name = '月亮')),
((SELECT id FROM public.poems WHERE title = '水调歌头·明月几时有'), (SELECT id FROM public.poem_tags WHERE name = '哲理')),
((SELECT id FROM public.poems WHERE title = '水调歌头·明月几时有'), (SELECT id FROM public.poem_tags WHERE name = '豪放'));

-- 将进酒标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '将进酒'), (SELECT id FROM public.poem_tags WHERE name = '豪放'));

-- 蜀道难标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '蜀道难'), (SELECT id FROM public.poem_tags WHERE name = '山水')),
((SELECT id FROM public.poems WHERE title = '蜀道难'), (SELECT id FROM public.poem_tags WHERE name = '豪放'));

-- 早发白帝城标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '早发白帝城'), (SELECT id FROM public.poem_tags WHERE name = '山水')),
((SELECT id FROM public.poems WHERE title = '早发白帝城'), (SELECT id FROM public.poem_tags WHERE name = '自然'));

-- 新增诗词的赏析数据
-- 杜甫 - 春望赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '春望'),
 'advanced',
 '此诗写于安史之乱期间，杜甫被困长安，目睹国破家亡的惨状。',
 '忧国忧民，思乡怀亲',
 ARRAY['对比', '拟人', '对仗'],
 ARRAY['忧国', '思乡', '悲愤'],
 ARRAY['山河', '草木', '花鸟', '烽火', '家书'],
 '国家虽然破败，山河依然存在；春天来临，城中草木茂盛。感时伤怀，看到花开也会流泪；恨别离愁，听到鸟鸣也会惊心。战火连绵三个月，一封家书抵得上万两黄金。',
 '这首诗是杜甫现实主义诗歌的代表作，通过"国破山河在"的对比，深刻表达了诗人对国家的忧虑和对亲人的思念。全诗语言精练，意境深远，体现了杜甫"沉郁顿挫"的诗风。');

-- 王维 - 山居秋暝赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '山居秋暝'),
 'basic',
 '王维隐居辋川时所作，描写秋天山居的宁静美景。',
 '山水田园，隐逸生活',
 ARRAY['动静结合', '视听结合', '对比'],
 ARRAY['宁静', '愉悦', '超脱'],
 ARRAY['空山', '新雨', '明月', '清泉', '竹林', '莲花'],
 '空山刚下过雨，天气已到秋天。明月照在松间，清泉流过石上。竹林喧闹，是洗衣女归来；莲花摇动，是渔船顺流而下。任凭春天的芳草凋谢，王孙自可留在这里。',
 '这首诗体现了王维"诗中有画，画中有诗"的艺术特色。通过动静结合的手法，描绘了一幅优美的山居秋景图，表达了诗人对隐逸生活的向往和对自然的热爱。');

-- 李清照 - 声声慢赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '声声慢'),
 'advanced',
 '此词写于李清照晚年，丈夫去世后，国破家亡，流离失所。',
 '孤独愁苦，国破家亡',
 ARRAY['叠字', '对比', '借景抒情'],
 ARRAY['孤独', '愁苦', '绝望'],
 ARRAY['淡酒', '晚风', '雁过', '黄花', '梧桐', '细雨'],
 '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。满地黄花堆积，憔悴损，如今有谁堪摘？守着窗儿，独自怎生得黑？梧桐更兼细雨，到黄昏、点点滴滴。这次第，怎一个愁字了得！',
 '这首词是李清照婉约词的代表作，开篇连用十四个叠字，营造出孤独凄凉的氛围。全词通过细腻的心理描写和生动的意象，表达了词人深重的愁苦之情，体现了婉约词"以情动人"的特色。');

-- 辛弃疾 - 破阵子赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '破阵子·为陈同甫赋壮词以寄之'),
 'advanced',
 '此词写于辛弃疾被罢官闲居期间，回忆当年抗金战斗的豪情。',
 '壮志未酬，英雄迟暮',
 ARRAY['对比', '夸张', '虚实结合'],
 ARRAY['豪迈', '悲愤', '无奈'],
 ARRAY['挑灯看剑', '吹角连营', '沙场点兵', '的卢马', '霹雳弓'],
 '醉里挑灯看剑，梦回吹角连营。八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。马作的卢飞快，弓如霹雳弦惊。了却君王天下事，赢得生前身后名。可怜白发生！',
 '这首词是辛弃疾豪放词的代表作，通过梦境与现实的对比，表达了词人壮志未酬的悲愤。全词气势磅礴，语言雄浑，体现了豪放词"以气动人"的特色，最后一句"可怜白发生"点出主题，令人感慨。');

-- 关汉卿 - 窦娥冤赏析
INSERT INTO public.poem_analyses (poem_id, type, background, theme, techniques, emotions, imagery, translation, appreciation) VALUES
((SELECT id FROM public.poems WHERE title = '窦娥冤·滚绣球'),
 'advanced',
 '这是关汉卿《窦娥冤》中的经典唱段，窦娥在临刑前的控诉。',
 '控诉不公，愤怒控诉',
 ARRAY['排比', '对比', '反问'],
 ARRAY['愤怒', '绝望', '控诉'],
 ARRAY['日月', '鬼神', '天地', '清浊', '盗跖', '颜渊'],
 '有日月朝暮悬，有鬼神掌着生死权。天地也！只合把清浊分辨，可怎生糊突了盗跖、颜渊？为善的受贫穷更命短，造恶的享富贵又寿延。天地也！做得个怕硬欺软，却原来也这般顺水推船！地也，你不分好歹何为地！天也，你错勘贤愚枉做天！哎，只落得两泪涟涟。',
 '这段唱词是元曲中的经典，通过窦娥对天地的控诉，深刻揭露了社会的不公。语言通俗易懂，情感激烈，体现了元曲"以俗为雅"的特色，是中国古代戏曲文学的杰作。');

-- 新增诗词的标签关联
-- 杜甫 - 春望标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '春望'), (SELECT id FROM public.poem_tags WHERE name = '思乡')),
((SELECT id FROM public.poems WHERE title = '春望'), (SELECT id FROM public.poem_tags WHERE name = '离别'));

-- 王维 - 山居秋暝标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '山居秋暝'), (SELECT id FROM public.poem_tags WHERE name = '山水')),
((SELECT id FROM public.poems WHERE title = '山居秋暝'), (SELECT id FROM public.poem_tags WHERE name = '自然'));

-- 李清照 - 声声慢标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '声声慢'), (SELECT id FROM public.poem_tags WHERE name = '离别')),
((SELECT id FROM public.poems WHERE title = '声声慢'), (SELECT id FROM public.poem_tags WHERE name = '秋天'));

-- 辛弃疾 - 破阵子标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '破阵子·为陈同甫赋壮词以寄之'), (SELECT id FROM public.poem_tags WHERE name = '豪放'));

-- 关汉卿 - 窦娥冤标签关联
INSERT INTO public.poem_tag_relations (poem_id, tag_id) VALUES
((SELECT id FROM public.poems WHERE title = '窦娥冤·滚绣球'), (SELECT id FROM public.poem_tags WHERE name = '哲理'));

-- ============================================
-- 5. 更新统计信息
-- ============================================
-- 更新诗词的点赞数和浏览数（模拟一些初始数据）
UPDATE public.poems SET 
  like_count = CASE 
    WHEN title = '静夜思' THEN 1250
    WHEN title = '春晓' THEN 980
    WHEN title = '水调歌头·明月几时有' THEN 1580
    WHEN title = '将进酒' THEN 1890
    WHEN title = '蜀道难' THEN 1450
    WHEN title = '早发白帝城' THEN 750
    WHEN title = '春望' THEN 1680
    WHEN title = '山居秋暝' THEN 1320
    WHEN title = '声声慢' THEN 1950
    WHEN title = '破阵子·为陈同甫赋壮词以寄之' THEN 2100
    WHEN title = '窦娥冤·滚绣球' THEN 1180
  END,
  view_count = CASE 
    WHEN title = '静夜思' THEN 25600
    WHEN title = '春晓' THEN 18900
    WHEN title = '水调歌头·明月几时有' THEN 32100
    WHEN title = '将进酒' THEN 28900
    WHEN title = '蜀道难' THEN 23400
    WHEN title = '早发白帝城' THEN 15600
    WHEN title = '春望' THEN 31200
    WHEN title = '山居秋暝' THEN 27800
    WHEN title = '声声慢' THEN 35600
    WHEN title = '破阵子·为陈同甫赋壮词以寄之' THEN 29800
    WHEN title = '窦娥冤·滚绣球' THEN 22400
  END,
  popularity_score = CASE 
    WHEN title = '静夜思' THEN 95
    WHEN title = '春晓' THEN 90
    WHEN title = '水调歌头·明月几时有' THEN 98
    WHEN title = '将进酒' THEN 99
    WHEN title = '蜀道难' THEN 97
    WHEN title = '早发白帝城' THEN 88
    WHEN title = '春望' THEN 92
    WHEN title = '山居秋暝' THEN 89
    WHEN title = '声声慢' THEN 94
    WHEN title = '破阵子·为陈同甫赋壮词以寄之' THEN 96
    WHEN title = '窦娥冤·滚绣球' THEN 91
  END;

-- ============================================
-- 6. 验证数据迁移结果
-- ============================================
DO $$
DECLARE
  poem_count INTEGER;
  poet_count INTEGER;
  dynasty_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO poem_count FROM public.poems;
  SELECT COUNT(*) INTO poet_count FROM public.poets;
  SELECT COUNT(*) INTO dynasty_count FROM public.dynasties;
  
  RAISE NOTICE '============================================';
  RAISE NOTICE '数据迁移完成！';
  RAISE NOTICE '============================================';
  RAISE NOTICE '迁移统计：';
  RAISE NOTICE '- 诗词数量: %', poem_count;
  RAISE NOTICE '- 诗人数量: %', poet_count;
  RAISE NOTICE '- 朝代数量: %', dynasty_count;
  RAISE NOTICE '============================================';
  RAISE NOTICE '已迁移的诗词：';
  RAISE NOTICE '唐诗类：';
  RAISE NOTICE '- 静夜思 (李白)';
  RAISE NOTICE '- 春晓 (孟浩然)';
  RAISE NOTICE '- 将进酒 (李白)';
  RAISE NOTICE '- 蜀道难 (李白)';
  RAISE NOTICE '- 早发白帝城 (李白)';
  RAISE NOTICE '- 春望 (杜甫)';
  RAISE NOTICE '- 山居秋暝 (王维)';
  RAISE NOTICE '宋词类：';
  RAISE NOTICE '- 水调歌头·明月几时有 (苏轼)';
  RAISE NOTICE '- 声声慢 (李清照)';
  RAISE NOTICE '- 破阵子·为陈同甫赋壮词以寄之 (辛弃疾)';
  RAISE NOTICE '元曲类：';
  RAISE NOTICE '- 窦娥冤·滚绣球 (关汉卿)';
  RAISE NOTICE '============================================';
  RAISE NOTICE '下一步：';
  RAISE NOTICE '1. 更新前端服务层代码';
  RAISE NOTICE '2. 测试数据库集成功能';
  RAISE NOTICE '3. 验证诗词数据正确显示';
  RAISE NOTICE '============================================';
END $$;
