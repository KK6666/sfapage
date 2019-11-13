import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import User from './views/User.vue'
import Notice from './views/Notice.vue'
import NoticeDetail from './views/NoticeDetail.vue'
import VisitShop from './views/VisitShop.vue'
import ShopInfo from './views/ShopInfo.vue'
import Sign from './views/Sign.vue'
import Order from './views/Order.vue'
import GoodsSelect from './views/GoodsSelect.vue'
import Cart from './views/Cart.vue'
import Remark from './views/Remark.vue'
import CartSubmit from './views/CartSubmit.vue'
import Future from './views/Future.vue'
import AddShop from './views/AddShop.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/notice',
      name: 'notice',
      component: Notice
    },
    {
      path: '/notice/:id',
      name: 'noticeDetail',
      component: NoticeDetail
    },
    {
      path: '/visitshop',
      name: 'VisitShop',
      component: VisitShop
    },
    {
      path: '/visitshop/:id',
      name: 'ShopInfo',
      component: ShopInfo
    },
    {
      path: '/shopsign/:id',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/order/:id',
      name: 'Order',
      component: Order
    },
    {
      path: '/goodsselect/:id',
      name: 'GoodsSelect',
      component: GoodsSelect
    },
    {
      path: '/cart/:goodsId',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/cartremark/:shopId/:warehouseId',
      name: 'Remark',
      component: Remark
    },
    {
      path: '/cartsubmit',
      name: 'CartSubmit',
      component: CartSubmit
    },
    {
      path: '/future',
      name: 'Future',
      component: Future
    },
    {
      path: '/phoneorder',
      redirect: '/future'
    },
    {
      path: '/orders',
      redirect: '/future'
    },
    {
      path: '/training',
      redirect: '/future'
    },
    {
      path: '/message',
      redirect: '/future'
    },
    {
      path: '/addedshop',
      name: 'AddShop',
      component: AddShop
    },
    {
      path: '/asyncdata',
      redirect: '/future'
    }
  ]
})
