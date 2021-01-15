<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Map',
  data () {
    return {
      // 图表实例
      chartInstance: null,
      // 请求地图数据
      allData: null
    }
  },
  mounted () {
    // 初始化实例
    this.initChart()
    // 请求数据
    this.getData()
    // 监听页面宽度变化
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    // 销毁监听页面宽度变化事件
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化实例
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      // 请求获取中国地图的矢量数据
      // 地图数据存放在根目录/static/map/
      const res = await axios.get('http://localhost:9000/static/map/china.json')
      // 注册地图数据
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: (arg) => {
            return `${arg.seriesName} <br />地址:${arg.name}`
          }
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 图例方向 默认从左到右 vertical改为从上到下
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 请求地图散点数据 (地图矢量图由本地提供而不是后端API,散点图由后端提供)
    async getData () {
      // 散点数据
      const { data: res } = await this.$axios.get('map')
      this.allData = res
      this.updateChart()
    },
    // 页面渲染
    updateChart () {
      // 筛选图例数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      // 处理图表需要的数据
      const seriesArr = this.allData.map(item => {
        // 返回的是 一个类别下的所有散点数据
        return {
          type: 'effectScatter', // 散点图 涟漪动画
          rippleEffect: { // 涟漪动画效果样式
            scale: 5, // 圆圈大小
            brushType: 'stroke' // 空心还是实心效果
          },
          tooltip: {

          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo' // 散点使用地图坐标系统
        }
      })
      const dataOption = {
        // 如果想在地图中显示散点的数据, 我们需要给散点的图表增加一个配置, coordinateSystem:geo
        series: seriesArr,
        // 图例筛选
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    // 页面宽度变化触发事件
    screenAdapter () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
