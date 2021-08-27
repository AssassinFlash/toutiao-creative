import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import store from '@/store/index'

const routes = [{
  path: '/login',
  name: 'Login',
  component: () => import('../views/login/index.vue')
},
{
  path: '/home', // 有了默认子路由，父路由就不要设置命名
  redirect: { name: 'Home' },
  component: () => import('@/views/layout/index'),
  children: [
    {
      path: '/home/index', // path为空，为默认子路由，即父路由的路由出口默认渲染这个路由
      name: 'Home',
      // 配置元信息，表示需要对用户令牌进行校验
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/home/index')
    },
    {
      path: '/home/article',
      name: 'Article',
      // 元信息
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/article/index')
    },
    {
      path: '/home/publish',
      name: 'Publish',
      // 元信息
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/publish/index')
    },
    {
      path: '/home/image',
      name: 'Images',
      // 元信息
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/image/index')
    },
    {
      path: '/home/comment',
      name: 'Comment',
      // 元信息
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/comment/index')
    },
    {
      path: '/home/settings',
      name: 'Settings',
      // 元信息
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/settings')
    },
    {
      path: '/home/fans',
      name: 'Fans',
      // 元信息
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/fans')
    }
  ]
}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 路由导航守卫：所有页面的导航都会经过这里
// to:要去的路由页面信息
// from:来自哪里的路由信息
// next:放行方法
router.beforeEach((to, from, next) => {
  // 如果访问的页面不是/login，校验登录状态
  // 如果没有登录，跳转到/login
  // 如果登录了，允许通过
  // 获取本地存储的用户令牌
  const userToken = window.localStorage.getItem('user')
  if (to.path !== '/home/login') {
    if (to.meta.requireAuth === true) {
      // console.log('该页面不是登录页，且需要校验')
      if (userToken) {
        console.log('已登录，允许通过')
        // 更改菜单选中项
        store.commit('popSelectedKeys')
        store.commit('setSelectedKeys', to.path)
        next()
      } else {
        console.log('未登录，跳转到登录页')
        next({
          name: 'Login'
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
