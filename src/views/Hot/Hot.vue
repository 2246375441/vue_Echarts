<!-- 热销商品图表 -->
<template>
  <div class='com-container'>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 图表实例数据
      chartInstance: null,
      // 请求数据
      allData: null
    }
  },
  mounted () {
    // 初始化实例
    this.initChart()
    // 请求数据函数
    this.getData()
    // 监听浏览器宽度变化触发响应式回调
    window.addEventListener('resize', this.screenAdapter)
    // 手动触发响应式回调
    this.screenAdapter()
  },
  destroyed () {
    // 销毁浏览器宽度变化监听事件
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化实例
    initChart () {
      // 初始化Echarts实例对象
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
      }
      this.chartInstance.setOption(initOption)
    },
    // 请求参数
    getData () {
      // 动态渲染数据方法
      this.updateChart()
    },
    // 动态渲染数据方法
    updateChart () {
      const dataOption = {

      }
      this.chartInstance.setOption(dataOption)
    },
    // 响应式事件
    screenAdapter () {
      // 根据游览器宽度计算对应响应值宽度大小
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {

      }
      this.chartInstance.setOption(adapterOption)
      // 调用Echarts实例方法(响应式)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang='less' scoped>

</style>
