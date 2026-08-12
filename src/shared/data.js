// src/shared/data.js
import { ref } from 'vue'

// ==================== 用户相关 ====================
export const currentUser = ref(null)

// 初始化用户（从 localStorage 读取）
export const initUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    currentUser.value = JSON.parse(userStr)
  }
}

// 更新用户状态的方法
export const updateUser = (userData) => {
  currentUser.value = userData
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData))
  } else {
    localStorage.removeItem('user')
  }
}

// ==================== 社区帖子数据 ====================
export const communityPosts = ref([
  {
    id: 1,
    title: '字节跳动前端一面面经（已拿offer）',
    author: '前端小王子',
    time: Date.now() - 3600000,
    content: '刚面完字节前端岗，热乎的面经！一面主要问了：\n\n1. Vue3响应式原理\n2. 闭包应用\n3. 算法题：两数之和\n4. 项目经验\n\n面试官很nice，全程引导...',
    summary: '刚面完字节前端岗，热乎的面经！一面主要问了：1. Vue3响应式原理 2. 闭包应用 3. 算法题...',
    views: 1234,
    likes: 89,
    replies: 12,
    category: '面经分享',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    title: 'Vue3和React到底选哪个？',
    author: '代码女侠',
    time: Date.now() - 86400000,
    content: '准备找工作了，不知道该主攻Vue还是React，有没有大佬给点建议？最近看招聘要求两个都要会，但是时间有限...',
    summary: '准备找工作了，不知道该主攻Vue还是React，有没有大佬给点建议？',
    views: 856,
    likes: 34,
    replies: 23,
    category: '技术问答',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    title: '【资源分享】前端学习路线图2024',
    author: '资源君',
    time: Date.now() - 172800000,
    content: '整理了最新前端学习路线，从HTML到Node.js，附免费视频教程链接：\n\n1. HTML/CSS基础\n2. JavaScript核心\n3. Vue3全家桶\n4. React入门\n5. Node.js后端\n\n需要的自取！',
    summary: '整理了最新前端学习路线，从HTML到Node.js，附免费视频教程链接...',
    views: 2341,
    likes: 156,
    replies: 45,
    category: '资源推荐',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 4,
    title: '35岁程序员何去何从',
    author: '中年码农',
    time: Date.now() - 259200000,
    content: '聊聊35岁程序员的职业规划和转型方向...',
    summary: '聊聊35岁程序员的职业规划和转型方向...',
    views: 543,
    likes: 67,
    replies: 34,
    category: '求职吐槽',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    id: 5,
    title: 'TypeScript高级技巧分享',
    author: 'TS大神',
    time: Date.now() - 345600000,
    content: '分享几个TypeScript的高级用法和技巧...',
    summary: '分享几个TypeScript的高级用法和技巧...',
    views: 432,
    likes: 45,
    replies: 12,
    category: '技术问答',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: 6,
    title: '阿里P7面试题汇总',
    author: '面试达人',
    time: Date.now() - 432000000,
    content: '收集了阿里P7级别的面试题，附答案解析...',
    summary: '收集了阿里P7级别的面试题，附答案解析...',
    views: 321,
    likes: 23,
    replies: 8,
    category: '面经分享',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 7,
    title: 'Node.js性能优化指南',
    author: '后端攻城狮',
    time: Date.now() - 518400000,
    content: 'Node.js项目性能优化的实践经验分享...',
    summary: 'Node.js项目性能优化的实践经验分享...',
    views: 298,
    likes: 19,
    replies: 6,
    category: '技术问答',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
  },
  {
    id: 8,
    title: '2024前端工具推荐',
    author: '工具控',
    time: Date.now() - 604800000,
    content: '盘点2024年最好用的前端开发工具...',
    summary: '盘点2024年最好用的前端开发工具...',
    views: 267,
    likes: 31,
    replies: 9,
    category: '资源推荐',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 9,
    title: '如何准备系统设计面试',
    author: '架构师',
    time: Date.now() - 691200000,
    content: '系统设计面试的准备工作和高频考点...',
    summary: '系统设计面试的准备工作和高频考点...',
    views: 456,
    likes: 42,
    replies: 15,
    category: '技术问答',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
  {
    id: 10,
    title: '大厂福利待遇对比',
    author: '职场观察员',
    time: Date.now() - 777600000,
    content: '对比各大互联网公司的福利待遇...',
    summary: '对比各大互联网公司的福利待遇...',
    views: 789,
    likes: 87,
    replies: 43,
    category: '求职吐槽',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    id: 11,
    title: 'React18新特性详解',
    author: 'React爱好者',
    time: Date.now() - 864000000,
    content: '深入讲解React18的新特性和使用技巧...',
    summary: '深入讲解React18的新特性和使用技巧...',
    views: 654,
    likes: 56,
    replies: 21,
    category: '技术问答',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
  },
  {
    id: 12,
    title: '前端工程化实践',
    author: '工程狮',
    time: Date.now() - 950400000,
    content: '分享前端工程化建设的经验和工具链...',
    summary: '分享前端工程化建设的经验和工具链...',
    views: 543,
    likes: 48,
    replies: 17,
    category: '资源推荐',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
  }
])

// ==================== 题库文章数据 ====================
export const knowledgeArticles = ref([
  {
    id: 1,
    title: '字节跳动前端一面面经（已拿offer）',
    summary: '刚面完字节前端岗，热乎的面经！一面主要问了：Vue3响应式原理、闭包应用、算法题两数之和、项目经验...',
    content: '完整文章内容...',
    author: '前端小王子',
    views: 1234,
    likes: 89,
    comments: 12,
    date: '2024-03-15',
    tags: ['面经', '字节', '一面'],
    category: '面经',
    readTime: '8分钟'
  },
  {
    id: 2,
    title: 'Vue3响应式原理详解（附源码分析）',
    summary: '深入解析Vue3的响应式系统，从Proxy到Reflect，手写mini版响应式源码...',
    content: '完整文章内容...',
    author: '源码猎人',
    views: 856,
    likes: 34,
    comments: 23,
    date: '2024-03-10',
    tags: ['Vue3', '源码', '进阶'],
    category: 'Vue',
    readTime: '15分钟'
  },
  {
    id: 3,
    title: '前端必刷算法题：二叉树遍历',
    summary: '二叉树的前序、中序、后序、层序遍历，递归与非递归实现，附LeetCode题解...',
    content: '完整文章内容...',
    author: '算法大师',
    views: 2341,
    likes: 156,
    comments: 45,
    date: '2024-03-05',
    tags: ['算法', '二叉树', 'LeetCode'],
    category: '算法题',
    readTime: '12分钟'
  },
  {
    id: 4,
    title: 'JavaScript闭包在实际开发中的应用',
    summary: '闭包不只是面试题！实际项目中的应用场景：防抖节流、模块化、循环绑定...',
    content: '完整文章内容...',
    author: 'JS专家',
    views: 567,
    likes: 23,
    comments: 8,
    date: '2024-03-01',
    tags: ['JavaScript', '闭包', '进阶'],
    category: 'JavaScript',
    readTime: '6分钟'
  },
  {
    id: 5,
    title: '浏览器渲染原理：从输入URL到页面显示',
    summary: '完整解析浏览器渲染流程：DNS解析、TCP连接、HTTP请求、构建DOM树、渲染树...',
    content: '完整文章内容...',
    author: '性能优化专家',
    views: 1890,
    likes: 98,
    comments: 34,
    date: '2024-02-28',
    tags: ['浏览器', '渲染', '性能'],
    category: '网络',
    readTime: '10分钟'
  },
  {
    id: 6,
    title: 'React Hooks原理与最佳实践',
    summary: 'useState、useEffect、useMemo等Hooks的实现原理，以及实际项目中的使用技巧...',
    content: '完整文章内容...',
    author: 'React大神',
    views: 2345,
    likes: 167,
    comments: 56,
    date: '2024-02-25',
    tags: ['React', 'Hooks', '实战'],
    category: 'React',
    readTime: '12分钟'
  },
  {
    id: 7,
    title: '阿里P7面试题汇总',
    summary: '收集了阿里P7级别的面试题，附答案解析...',
    content: '完整文章内容...',
    author: '面试达人',
    views: 432,
    likes: 45,
    comments: 12,
    date: '5天前',
    tags: ['面经', '阿里', 'P7'],
    category: '面经',
    readTime: '12分钟'
  }
])

// ==================== 聊天对话数据 ====================
export const conversations = ref([
  { 
    id: 1, 
    title: 'Vue3响应式原理', 
    lastMessage: 'Proxy和Reflect的区别是什么？',
    time: '2小时前',
    unread: 0
  },
  { 
    id: 2, 
    title: '面经求助', 
    lastMessage: '字节跳动面试经验',
    time: '昨天',
    unread: 3
  },
  { 
    id: 3, 
    title: '算法题讨论', 
    lastMessage: '二叉树遍历',
    time: '2024-03-01',
    unread: 0
  }
])

export const messagesMap = ref({
  1: [
    { id: 1, role: 'user', content: 'Vue3的响应式原理是什么？', time: '10:30' },
    { id: 2, role: 'assistant', content: 'Vue3使用Proxy对象来实现响应式系统。相比Vue2的Object.defineProperty，Proxy可以监听整个对象的变化，包括属性的添加和删除，性能也更好。', time: '10:31' },
    { id: 3, role: 'user', content: '那Reflect是做什么的？', time: '10:32' },
    { id: 4, role: 'assistant', content: 'Reflect是一个内置对象，提供拦截JavaScript操作的方法。在Vue3中，Reflect与Proxy配合使用，确保默认行为能够正常进行，比如触发数组的更新等。', time: '10:33' }
  ],
  2: [
    { id: 1, role: 'user', content: '字节跳动面试都问什么？', time: '昨天 14:20' },
    { id: 2, role: 'assistant', content: '主要考察：Vue/React框架原理、JavaScript基础、算法题、项目经验。需要我详细说说吗？', time: '昨天 14:21' }
  ],
  3: [
    { id: 1, role: 'user', content: '二叉树的前序遍历怎么写？', time: '2024-03-01 09:15' },
    { id: 2, role: 'assistant', content: '递归写法：先访问根节点，再遍历左子树，最后右子树。需要代码示例吗？', time: '2024-03-01 09:16' }
  ]
})

// ==================== 面试记录数据 ====================
export const interviewRecords = ref([
  {
    id: 1,
    type: 'video',
    date: '2024-03-15',
    time: '14:30',
    topic: 'Vue3前端面试',
    duration: 45,
    rounds: 12,
    score: 4.2,
    tags: ['Vue3', '响应式', '生命周期'],
    strengths: ['响应式原理解释清晰', '生命周期掌握好'],
    weaknesses: ['性能优化需要加强'],
    conversation: [
      {
        question: '请解释Vue3的响应式原理',
        answer: 'Vue3使用Proxy代理对象来实现响应式...',
        evaluation: '回答准确，解释了Proxy和Reflect的配合使用',
        score: 4
      },
      {
        question: '说说Vue3和Vue2响应式的区别',
        answer: 'Vue2使用Object.defineProperty，只能监听已有属性...',
        evaluation: '提到了主要区别，但可以补充性能对比',
        score: 3
      }
    ]
  },
  {
    id: 2,
    type: 'text',
    date: '2024-03-10',
    time: '10:00',
    topic: '字节跳动前端一面模拟',
    duration: 45,
    rounds: 15,
    score: 3.8,
    tags: ['面经', '字节', '一面'],
    strengths: ['算法题解答准确'],
    weaknesses: ['项目经验描述不够深入'],
    conversation: []
  },
  {
    id: 3,
    type: 'video',
    date: '2024-03-05',
    time: '16:00',
    topic: '算法题专项训练',
    duration: 50,
    rounds: 10,
    score: 4.5,
    tags: ['算法', '二叉树', '动态规划'],
    strengths: ['二叉树遍历掌握熟练', '思路清晰'],
    weaknesses: ['动态规划需要多练习'],
    conversation: []
  }
])

// ==================== 收藏数据 ====================
export const userFavorites = ref([
  {
    id: 1,
    userId: 1,
    type: 'post',
    targetId: 1,
    title: '字节跳动前端一面面经（已拿offer）',
    author: '前端小王子',
    date: '2024-03-15'
  },
  {
    id: 2,
    userId: 1,
    type: 'article',
    targetId: 2,
    title: 'Vue3响应式原理详解（附源码分析）',
    author: '源码猎人',
    date: '2024-03-10'
  }
])

// ==================== 操作方法 ====================

// 社区帖子操作
export const addPost = (newPost) => {
  communityPosts.value.unshift(newPost)
}

export const deletePost = (id) => {
  const index = communityPosts.value.findIndex(p => p.id === id)
  if (index !== -1) {
    communityPosts.value.splice(index, 1)
  }
}

export const updatePost = (id, updatedPost) => {
  const index = communityPosts.value.findIndex(p => p.id === id)
  if (index !== -1) {
    communityPosts.value[index] = { ...communityPosts.value[index], ...updatedPost }
  }
}

// 获取用户的帖子
export const getUserPosts = (username) => {
  return communityPosts.value.filter(p => p.author === username)
}

// ==================== 收藏操作方法 ====================

// 检查是否已收藏
export const isFavorite = (userId, type, targetId) => {
  return userFavorites.value.some(
    f => f.userId === userId && f.type === type && f.targetId === targetId
  )
}

// 添加收藏
export const addFavorite = (userId, type, target) => {
  // 先检查是否已经收藏
  if (isFavorite(userId, type, target.id)) return false
  
  userFavorites.value.push({
    id: Date.now(),
    userId,
    type,
    targetId: target.id,
    title: target.title,
    author: target.author,
    date: new Date().toLocaleDateString()
  })
  return true
}

// 取消收藏
export const removeFavorite = (userId, type, targetId) => {
  const index = userFavorites.value.findIndex(
    f => f.userId === userId && f.type === type && f.targetId === targetId
  )
  if (index !== -1) {
    userFavorites.value.splice(index, 1)
    return true
  }
  return false
}

// 获取用户的收藏
export const getUserFavorites = (userId) => {
  return userFavorites.value.filter(f => f.userId === userId)
}

// 面试记录操作
export const addInterviewRecord = (record) => {
  interviewRecords.value.unshift({
    id: Date.now(),
    ...record
  })
}

export const getInterviewRecord = (id) => {
  return interviewRecords.value.find(r => r.id === id)
}

export const getUserInterviews = () => {
  return interviewRecords.value
}

// 初始化用户
initUser()