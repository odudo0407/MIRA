import { createRouter, createWebHistory } from 'vue-router'

// 首页
import Home from '@/views/Home/index.vue'

// 定义路由规则
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页 - MIRA模拟面试' } 
  },
  {
    path: '/community',
    name: 'community',
    // 社区列表页
    component: () => import('@/views/Community/index.vue'),
    meta: { title: '社区 - MIRA模拟面试' } 
  },
  {
    path: '/community/post/:id',
    name: 'post-detail',
    // 帖子详情页（:id 是动态参数，比如 /community/post/1）
    component: () => import('@/views/Community/post/[id].vue'),
    meta: { title: '帖子详情 - MIRA模拟面试' } 
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('@/views/Knowledge/index.vue'),
    meta: { title: '题库 - MIRA模拟面试' } 
  },
  {
    path: '/knowledge/article/:id',
    name: 'knowledge-detail',
    component: () => import('@/views/Knowledge/article/[id].vue'),
    meta: { title: '文章详情 - MIRA模拟面试' } 
  },
  {
    path: '/interview',
    name: 'interview',
    // 模拟面试主页面（选择面试方式）
    component: () => import('@/views/Interview/index.vue'),
    meta: { title: '选择面试方式 - MIRA模拟面试' } 
  },
  {
    path: '/interview/digital-human',
    name: 'digital-human',
    // 数字人面试页面
    component: () => import('@/views/Interview/DigitalHuman/index.vue'),
    meta: { 
      title: '视频面试 - MIRA模拟面试',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/interview/text',
    name: 'text-interview',
    // 文字面试页面
    component: () => import('@/views/Interview/TextInterview/index.vue'),
    meta: { 
      title: '文字面试 - MIRA模拟面试',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/login',
    name: 'login',
    // 登录页
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '登录 - MIRA模拟面试' } 
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat/index.vue'),
    meta: { 
      title: 'AI助手 - MIRA模拟面试',
      requiresAuth: true  // 需要登录
    }
  },
  // 个人中心
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile/index.vue'),
    meta: { 
      requiresAuth: true,
      title: '个人中心 - MIRA模拟面试' 
    },
    children: [
      {
        path: '',
        redirect: '/profile/posts'
      },
      {
        path: 'posts',
        name: 'ProfilePosts',
        component: () => import('@/views/Profile/posts/index.vue'),
        meta: { title: '我的帖子 - MIRA模拟面试' }
      },
      {
        path: 'favorites',
        name: 'ProfileFavorites',
        component: () => import('@/views/Profile/favorites/index.vue'),
        meta: { title: '我的收藏 - MIRA模拟面试' }
      },
      {
        path: 'interviews',
        name: 'ProfileInterviews',
        component: () => import('@/views/Profile/interviews/index.vue'),
        meta: { title: '面试记录 - MIRA模拟面试' }
      },
      {
        path: 'interviews/:id',
        name: 'InterviewDetail',
        component: () => import('@/views/Profile/interviews/[id].vue'),
        meta: { title: '面试详情 - MIRA模拟面试' }
      },
      {
        path: 'settings',
        name: 'ProfileSettings',
        component: () => import('@/views/Profile/settings/index.vue'),
        meta: { title: '账户设置 - MIRA模拟面试' }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 修改网页标题和检查登录状态
router.beforeEach((to, from, next) => {
  // 设置网页标题
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'MIRA模拟面试'
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    // 检查是否登录（从 localStorage 获取）
    const isLogin = !!localStorage.getItem('user')
    
    if (isLogin) {
      // 已登录，正常跳转
      next()
    } else {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原路径，登录后可跳回
      })
    }
  } else {
    // 不需要登录，直接跳转
    next()
  }
})

export default router