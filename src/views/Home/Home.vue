<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="">
      </div>
      <span class="logo">
        <!-- <img :src="logoSrc" alt="">-->
      </span>
      <span class="title">Echarts监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan"  alt="" @click="handleChangeTheme">
        <span class="datetime">
          <!--时间-->
        </span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen':'']" >
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <span :class="['iconfont',fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']" @click="changeSize('trend')"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen':'']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <span  :class="['iconfont',fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"  @click="changeSize('seller')"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen':'']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <span  :class="['iconfont',fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"  @click="changeSize('map')"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen':'']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <span  :class="['iconfont',fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"  @click="changeSize('rank')"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen':'']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <span  :class="['iconfont',fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"  @click="changeSize('hot')"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen':'']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <span  :class="['iconfont',fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"  @click="changeSize('stock')"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '../Hot/HotPage'
import Map from '../Map/MapPage'
import Rank from '../Rank/RankPage'
import Seller from '../Seller/SellerPage'
import Stock from '../Stock/StockPage'
import Trend from '../Trend/TrendPage'
import { mapState } from 'vuex'
import { getThemeValue } from '../../utils/theme_utils'
export default {
  data () {
    return {
      // 定义每一个图表的全屏状态数据
      fullScreenStatus: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false
      }
    }
  },
  created () {
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  destroyed () {
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('themeChange')
  },
  methods: {
    // 图表全屏按钮
    changeSize (chartName) {
      // ☆ 点击图表缩放按钮 启动全屏
      // // 1 改变fullScreenStatus容器中对应变量
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // // 2 调用图表内部的screenAdapter方法完成自适应
      // this.$nextTick(() => {
      //   this.$refs[chartName].$children[0].screenAdapter()
      // })

      // ☆ 多客户端联动
      const targerValue = !this.fullScreenStatus[chartName]
      // 将数据发送给webSocket服务端 服务器将数据转发给每一个连接的浏览器
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targerValue
      })
    },
    // 接收到全屏数据之后的处理
    recvData (data) {
      // 取出哪个图表需要进行切换
      const chartName = data.chartName
      // 取出,切换成什么状态
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].$children[0].screenAdapter()
      })
    },
    // 修改主题(修改vuex中state数据)
    handleChangeTheme () {
      // this.$store.commit('changTheme')
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: ''
      })
    },
    recvThemeChange () {
      this.$store.commit('changTheme')
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  computed: {
    ...mapState(['theme']),
    logoSrc () {
      // 原项目
      // return '/static/img/' + getThemeValue(this.theme).logoSrc
      return 'static/img/' + getThemeValue(this.theme).logoSrc
    },
    headerSrc () {
      return 'static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc () {
      return 'static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle () {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor

      }
    }

  }
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
