// 个人信息
export const personalInfo = {
  name: 'LLL',
  age: 18,
  status: '准大学生',
  email: '1175527050@qq.com',
  bio: '一名热爱技术的年轻人，即将踏入大学的校门。对编程和设计充满热情，喜欢探索新技术，不断学习和成长。',
  interests: ['编程', '设计', '游戏', '音乐', '阅读'],
  learning: ['React', 'TypeScript', 'Node.js', 'Python', 'UI设计'],
};

// 技能数据
export const skills = [
  { name: 'HTML/CSS', level: 85, category: '前端' },
  { name: 'JavaScript', level: 75, category: '前端' },
  { name: 'React', level: 70, category: '前端' },
  { name: 'TypeScript', level: 65, category: '前端' },
  { name: 'Python', level: 60, category: '后端' },
  { name: 'Node.js', level: 50, category: '后端' },
  { name: 'Git', level: 70, category: '工具' },
  { name: 'VS Code', level: 85, category: '工具' },
  { name: 'Figma', level: 55, category: '设计' },
  { name: 'Photoshop', level: 45, category: '设计' },
];

// 作品数据
export const projects = [
  {
    id: 1,
    title: '个人作品集网站',
    description: '使用 React + TypeScript + Tailwind CSS 构建的个人作品集网站，展示个人信息、技能和作品。',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20modern%20dark-themed%20portfolio%20website%20with%20neon%20cyan%20and%20purple%20accents%2C%20glassmorphism%20design%2C%20hero%20section%20with%20animated%20background&image_size=landscape_16_9',
    demo: '#',
    github: '#',
    category: '前端',
  },
  {
    id: 2,
    title: '待办事项应用',
    description: '一个简洁的待办事项管理应用，支持添加、删除、标记完成等功能，数据本地存储。',
    tech: ['React', 'LocalStorage', 'CSS'],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20clean%20todo%20list%20application%20interface%20with%20dark%20mode%2C%20gradient%20checkboxes%2C%20minimalist%20design&image_size=landscape_16_9',
    demo: '#',
    github: '#',
    category: '前端',
  },
  {
    id: 3,
    title: '天气查询工具',
    description: '实时天气查询工具，显示当前天气状况和未来几天的天气预报。',
    tech: ['JavaScript', 'API', 'CSS'],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20weather%20app%20dashboard%20with%20animated%20clouds%2C%20temperature%20display%2C%20gradient%20blue%20sky%20background&image_size=landscape_16_9',
    demo: '#',
    github: '#',
    category: '前端',
  },
  {
    id: 4,
    title: '计算器应用',
    description: '一个功能完整的计算器应用，支持基本运算和科学计算功能。',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20modern%20calculator%20app%20with%20neon%20buttons%2C%20dark%20glass%20interface%2C%20iOS%20style%20design&image_size=landscape_16_9',
    demo: '#',
    github: '#',
    category: '前端',
  },
];

// 社交链接
export const socialLinks = [
  { name: 'QQ邮箱', icon: 'mail', href: 'mailto:1175527050@qq.com' },
];