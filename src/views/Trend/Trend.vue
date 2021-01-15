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
      const initOption = {}
      // 渲染图表
      this.chartInstance.setOption(initOption)
    },
    // 请求数据
    async getData () {
      this.updateChart()
    },
    // 图表更新
    updateChart () {
      // 数据配置项
      const dataOption = {}
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
