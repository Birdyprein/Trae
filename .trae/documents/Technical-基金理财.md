# 技术架构文档：基金理财网页

## 1. 架构设计

单文件HTML架构：
```
index.html (完整单页应用)
├── <head> - CSS变量定义、全局样式、响应式媒体查询
├── <body>
│   ├── header#header - 导航栏
│   ├── main#main - 主内容区
│   │   ├── section.market - 市场行情
│   │   ├── section.rankings - 基金排行
│   │   ├── section.carousel - 热门轮播
│   │   └── section.trading - 模拟交易
│   ├── div.modal - 模态框
│   └── footer#footer - 底部信息
└── <script> - JavaScript逻辑
```

## 2. 技术选型

- **结构**：HTML5语义化标签
- **样式**：CSS3（含CSS变量、Sass变量风格）、媒体查询
- **交互**：原生JavaScript ES6+
- **图标**：内联SVG图标
- **字体**：PingFang SC（中文）、Roboto（英文）

## 3. 响应式断点

| 断点 | 设备 | 布局变化 |
|------|------|----------|
| >1200px | PC | 完整表格、3列底部 |
| 768px-1200px | 平板 | 自适应、汉堡菜单 |
| <480px | 移动 | 卡片列表、单列、折叠 |

## 4. 数据模型

```javascript
// 基金数据
const funds = [
  {
    rank: 1,
    code: "000001",
    name: "华夏成长混合",
    type: "混合型",
    netValue: 3.2456,
    change: 2.34,
    changePercent: 2.15,
    yearReturn: 45.67
  }
]

// 指数数据
const indices = [
  { name: "上证指数", code: "000001", value: 3256.78, change: 15.67, changePercent: 0.48 }
]
```

## 5. 关键交互

1. **搜索功能**：输入检测、模糊匹配提示
2. **表格/卡片切换**：媒体查询 + JavaScript类名切换
3. **轮播**：自动播放（5秒间隔）、手动切换
4. **表单验证**：金额格式、必填项、范围检测
5. **模态框**：淡入动画、点击遮罩关闭、ESC键关闭

## 6. 无障碍支持

- aria-label标签
- role属性
- 键盘焦点管理
- 对比度符合WCAG标准
