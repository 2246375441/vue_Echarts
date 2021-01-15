<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data () {
    return {
      // 存储图表实例
      chartInstance: null,
      // 服务器请求响应数据
      allData: null
    }
  },
  mounted () {
    // 初始化图表实例
    this.initChart()
    // 请求数据
    this.getData()
    // 分辨率适配
    window.addEventListener('resize', this.screenAdapter)
    // 初始化分辨率适配
    this.screenAdapter()
  },
  destroyed () {
    // 取消监听屏幕大小更新事件
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化图表
    initChart () {
      // 初始化实例
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref)
      // 初始化图表设置配置项
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        }
      }
      // 渲染图表
      this.chartInstance.setOption(initOption)
    },
    // 请求数据
    async getData () {
      // 发送请求 通过数据结构 获取内部data数据变量
      const { data: res } = await this.$axios.get('trend')
      // 将数据存储到data中
      this.allData = res
      this.updateChart()
    },
    // 图表更新
    updateChart () {
      // x轴月份数据 ['一月','二月'.....]
      const timeArr = this.allData.common.month
      // y轴地区数据 [{type: "line", data: [12,44,55,...], stack: "map"},{}....]
      const valueArr = this.allData.map.data
      // 处理y轴数据
      const seriesArr = valueArr.map(item => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'map' // 将样式转换为堆叠图
        }
      })
      // 图例筛选数据 ["上海", "北京", "深圳", "广州", "重庆"] 每根折线图对应的name
      const legendArr = valueArr.map(item => {
        return item.name
      })
      // 数据配置项
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr // 筛选数据 内部name必须与seriesArr中name对应
        },
        series: seriesArr
      }
      // 渲染图表
      this.chartInstance.setOption(dataOption)
    },
    // 分辨率适配
    screenAdapter () {
      // 分辨率适配配置项
      const adapterOption = {}
      // 渲染图表
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
