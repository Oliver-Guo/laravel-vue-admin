import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 進度條
import 'nprogress/nprogress.css'// Progress 進度條樣式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

const whiteList = ['/login'] // 不重定向白名單
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 非重整頁面 判斷權限
      if (to.name !== 'Dashboard' && from.name !== null) {
        const tmpName = to.name

        if (store.getters.auths[tmpName] !== true) {
          next({ path: '/' })
        }
      }

      if (store.getters.name === '') {
        // 拉取用户信息
        store.dispatch('GetInfo').then(res => {
          // 重整頁面 判斷權限
          if (to.name !== 'Dashboard') {
            const tmpName2 = to.name
            if (store.getters.auths[tmpName2] !== true) {
              next({ path: '/' })
            }
          }

          next()
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('驗證失敗,請重新登入')
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
