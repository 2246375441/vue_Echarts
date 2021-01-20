<template>
  <div class="com-container" @dblclick="revertMap">
    <div ref="map_ref" class="com-chart"></div>
  </div>
</template>

<script>
// 用来进行导入根目录下的china.json文件
import axios from 'axios'
// 导入工具函数 传入中文参数 返回对应json数据路径
import { getProvinceMapInfo } from '../../utils/map_utils'
import { mapState } from 'vuex'
export default {
  name: 'Map',
  data () {
    return {
      // 图表实例
      chartInstance: null,
      // 请求地图数据
      allData: null,
      // 获取省份地图矢量数据缓存
      mapData: {}
    }
  },
  created () {
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    // 初始化实例
    this.initChart()
    // 请求数据
    // this.getData()
    this.$socket.send({
      action: 'getData', // 操作类型
      socketType: 'mapData', // 回调函数名字
      chartName: 'map' // 请求json的文件名
    })
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
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
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
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              position: 'inside',
              fontWeight: 'bold'
            }
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 图例方向 默认从左到右 vertical改为从上到下
        }
      }
      this.chartInstance.setOption(initOption)

      // 地图点击事件监听 (点击进入省详情地图)
      this.chartInstance.on('click', async (arg) => {
        // 可以通过arg.name获取 点击的是那个省
        // 通过导入的工具函数 获取对应根目录下的json数据
        const provinceInfo = getProvinceMapInfo(arg.name)
        if (provinceInfo.ts) {
          alert(provinceInfo.ts)
        } else {
          // 判断缓存中是否存在该地图数据,有则直接开始渲染 没有则获取发送请求
          if (!this.mapData[provinceInfo.key]) {
            // 请求json数据
            const res = await axios.get(this.websiteUrl + provinceInfo.path)
            // 缓存请求数据
            this.mapData[provinceInfo.key] = res.data
            // 注册矢量地图数据
            this.$echarts.registerMap(provinceInfo.key, res.data)
          }
          const changeOption = {
            geo: {
              map: provinceInfo.key
            }
          }
          this.chartInstance.setOption(changeOption)
        }
      })
    },
    // 请求地图散点数据 (地图矢量图由本地提供而不是后端API,散点图由后端提供)
    async getData (ret) {
      // 散点数据
      // const { data: res } = await this.$axios.get('map')
      // this.allData = res

      // 使用webSocket请求数据
      this.allData = ret

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
          tooltip: {},
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
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      // Echarts自带方法 计算图表大小 实现响应式
      this.chartInstance.resize()
    },
    // 鼠标双击地图退出
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      // console.log('主题切换')
      // 销毁当前 图表
      this.chartInstance.dispose()
      this.initChart() // 重新初始化
      this.screenAdapter() // 完成屏幕适配
      this.updateChart() // 更新图表数据展示
    }
  }
}
</script>

<style scoped>

</style>
