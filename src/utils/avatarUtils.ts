/**
 * 头像工具函数
 */

/**
 * 处理头像加载失败，生成文字头像
 * @param event 图片加载错误事件
 * @param defaultColor 默认背景色
 */
export const handleAvatarError = (event: Event, defaultColor: string = '#6B7280') => {
  const img = event.target as HTMLImageElement;

  // 创建一个简单的文字头像作为备用
  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 根据作者姓名设置不同的背景色
    const colors: Record<string, string> = {
      '李白': '#8B4513',      // 棕色，体现诗仙的豪放
      '杜甫': '#2F4F4F',      // 深青色，体现诗圣的深沉
      '苏轼': '#228B22',       // 绿色，体现文人的清新
      '墨香书生': '#8B5CF6',
      '诗韵雅音': '#F59E0B',
      '山水清音': '#10B981',
      '木人': '#EF4444',
      '世界': '#3B82F6'
    };

    const authorName = img.alt || '用户';
    const color = colors[authorName] || defaultColor;

    // 绘制圆形背景
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(48, 48, 48, 0, 2 * Math.PI);
    ctx.fill();

    // 绘制文字
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 如果是中文名，取第一个字符；如果是英文名，取前两个字符
    const text = authorName.length > 2 ? authorName.charAt(0) : authorName.substring(0, 2);
    ctx.fillText(text, 48, 48);

    // 将canvas转换为图片
    img.src = canvas.toDataURL();
  }
};

/**
 * 生成默认头像URL
 * @param name 用户名
 * @param size 头像大小
 */
export const generateDefaultAvatar = (name: string, size: number = 200): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#8B5CF6', '#F59E0B', '#10B981'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}"/>
      <text x="${size/2}" y="${size/2 + 10}" font-family="serif" font-size="${size/3}" font-weight="bold" text-anchor="middle" fill="white">${name.charAt(0)}</text>
    </svg>
  `)}`;
};
