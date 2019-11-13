import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TopHead from './components/TopHead.vue'
import './lib/hotcss/hotcss.js'
import './lib/common.scss'
import VeeValidate from 'vee-validate'
import inobounce from 'inobounce'

Vue.config.productionTip = false

// 全局使用VeeValidate
Vue.use(VeeValidate)
// inobounce解决ios的上下拉回弹动画
Vue.use(inobounce)

// 全局注册TopHead组件
Vue.component('TopHead', TopHead)

// 路由守卫--当进行页面跳转前,校验是否已经进行过登录(这里通过vuex是否保存有用户信息判断)
router.beforeEach((to, from, next) => {
  // 当要跳转的路径不是'/'，即非登录的页面
  if (to.path != '/') {
    // 当要用户的信息不存在，即还没通过登录校验，跳转至登录页（即'/'）
    if (!store.getters.getLoginUser) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
