# 技术架构文档

## 技术栈

### 核心框架
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 样式方案
- **Tailwind CSS** - 原子化CSS
- **CSS Modules** - 组件样式隔离
- **CSS Variables** - 主题定制

### 动画库
- **Framer Motion** - 流畅动画
- **CSS Animations** - 基础动效

### 工具库
- **clsx** - 类名拼接
- **tailwind-merge** - Tailwind类名合并

## 项目结构

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # 导航栏
│   │   └── Footer.tsx          # 页脚
│   ├── sections/
│   │   ├── Hero.tsx            # 首屏区域
│   │   ├── About.tsx           # 关于我
│   │   ├── Skills.tsx          # 技能展示
│   │   ├── Projects.tsx        # 作品展示
│   │   └── Contact.tsx         # 联系方式
│   └── ui/
│       ├── Button.tsx          # 按钮组件
│       ├── Card.tsx            # 卡片组件
│       └── GlowText.tsx       # 发光文字
├── hooks/
│   └── useScrollPosition.ts    # 滚动位置
├── data/
│   └── portfolio.ts            # 作品集数据
├── styles/
│   └── globals.css             # 全局样式
├── App.tsx                     # 根组件
└── main.tsx                    # 入口文件
```

## 设计系统

### 颜色方案
```css
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--accent-cyan: #00f5ff
--accent-purple: #a855f7
--accent-pink: #ec4899
--text-primary: #ffffff
--text-secondary: #94a3b8
```

### 字体
- 标题：Orbitron (科技感)
- 正文：Inter (可读性)

### 动画
- 页面加载：淡入 + 向上滑动
- 滚动触发：Intersection Observer
- 悬停效果：缩放 + 发光
- 过渡时长：0.3s - 0.6s

## 组件设计

### Hero 组件
- 全屏展示
- 动态粒子背景
- 个人介绍文字
- CTA按钮

### Skills 组件
- 技能条可视化
- 分类展示
- 动画进度条

### Projects 组件
- 网格布局
- 悬停放大效果
- 技术标签
- 项目链接

### Contact 组件
- 联系表单（可选）
- 社交链接
- 邮箱展示

## 性能优化
- 图片懒加载
- 组件懒加载
- CSS压缩
- 代码分割

## 浏览器兼容
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+