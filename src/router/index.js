import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/Seller/SellerPage'
import TrendPage from '../views/Trend/TrendPage'
import MapPage from '../views/Map/MapPage'
import RankPage from '../views/Rank/RankPage'

Vue.use(VueRouter)

const routes = [
  {
    // 商家销售柱状图
    name: 'SellerPage',
    path: '/SellerPage',
    component: SellerPage
  },
  {
    // 商家折线图
    name: 'TrendPage',
    path: '/TrendPage',
    component: TrendPage
  },
  {
    // 地图
    name: 'MapPage',
    path: '/MapPage',
    component: MapPage
  },
  {
    // 柱状图
    name: 'RankPage',
    path: '/RankPage',
    component: RankPage
  }
]

const router = new VueRouter({
  routes
})

export default router
