<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
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
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref)
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    // 请求数据
    async getData () {
      this.updateChart()
    },
    // 页面渲染
    updateChart () {
      const dataOption = {}
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
