import Vue from 'vue'
import VueRouter from 'vue-router'

// 容器组件
import Main from '../components/main/Main'

// 路由组件
import Login from '../views/login/Login'
import Home from '../views/home/Home'
import Content from '../views/content/Content'
import Material from '../views/material/Material'
import Issue from '../views/issue/Issue'
import Comment from '../views/comment/Comment'
import Fans from '../views/fans/Fans'
import Settings from '../views/settings/Settings'

Vue.use(VueRouter)

const routes = [
  // 重定向
  {
    path: '/',
    redirect: '/home'
  },

  // 登录路由
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  // 容器组件
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      // 首页展示 /home
      {
        path: '/home',
        name: 'home',
        component: Home
      },
      // 内容管理 /content
      {
        path: '/content',
        name: 'content',
        component: Content
      },
      // 素材管理 /material
      {
        path: '/material',
        name: 'material',
        component: Material
      },
      // 发布文章 /issue
      {
        path: '/issue',
        name: 'issue',
        component: Issue
      },

      // 评论管理 /comment
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },

      // 粉丝管理 /fans
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      },

      // 个人设置 /settings
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, form, next) => {
  const _token = localStorage.getItem('token')
  if (to.path !== '/login' && !_token) {
    next('/login')
  } else {
    next()
  }

  if (to.path === '/login' && _token) {
    next('/home')
  }
})

export default router
