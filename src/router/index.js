import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/Seller/SellerPage'
import TrendPage from '../views/Trend/TrendPage'

Vue.use(VueRouter)

const routes = [
  {
    // 商家销售柱状图
    name: 'SellerPage',
    path: '/SellerPage',
    component: SellerPage
  },
  {
    name: 'TrendPage',
    path: '/TrendPage',
    component: TrendPage
  }
]

const router = new VueRouter({
  routes
})

export default router
