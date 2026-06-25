# 技术架构文档：墨韵 · 数字诗意画廊

## 1. 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        前端层                                │
│  React@18 + TailwindCSS@3 + Vite                          │
│  - 组件：HeroSection, ArtworkGrid, ArtworkModal, About     │
│  - 动画：Framer Motion + Canvas粒子系统                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        静态资源                              │
│  - 作品图片（使用 Unsplash 艺术类图片）                       │
│  - 字体：思源宋体/黑体（Google Fonts）                       │
└─────────────────────────────────────────────────────────────┘
```

## 2. 技术选型

- **前端框架**：React@18
- **样式方案**：TailwindCSS@3 + 自定义CSS变量
- **构建工具**：Vite
- **动画库**：Framer Motion（页面过渡），Canvas API（墨迹粒子）
- **路由**：React Router v6

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| `/` | 首页 - 画廊入口与作品展示 |
| `/about` | 关于页面 - 艺术家介绍 |

## 4. 数据模型

使用静态JSON模拟艺术作品数据：

```typescript
interface Artwork {
  id: string;
  title: string;
  poeticalTitle: string;  // 诗意标题，如"烟雨江南"
  description: string;
  poet: string;           // 配诗作者
  poem: string;           // 配诗内容
  imageUrl: string;
  year: string;
}
```

## 5. 组件结构

```
App
├── Router
│   ├── HomePage
│   │   ├── HeroSection (Canvas墨迹背景 + 呼吸标题)
│   │   ├── ArtworkGrid (作品网格)
│   │   └── ArtworkCard (单个作品卡片)
│   ├── ArtworkModal (作品详情模态)
│   └── AboutPage
│       ├── ArtistIntro
│       └── ContactInfo
```

## 6. 墨迹粒子系统设计

- 使用Canvas 2D绑定随机运动粒子
- 粒子属性：位置、速度、大小、透明度、墨色浓度
- 运动算法：噪声函数驱动的流场 + 边界反弹
- 性能优化：requestAnimationFrame + 粒子数量限制（桌面200/移动50）
