<!-- 库存销量分析 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='stock_ref'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // Echarts实例对象
      chartInstance: null,
      // 请求数据
      allData: null
    }
  },
  mounted () {
    // 初始化实例数据
    this.initChart()
    // 请求数据
    this.getData()
    // 监听页面宽度变化
    window.addEventListener('resize', this.screenAdapter)
    // 调用响应式方法
    this.screenAdapter()
  },
  destroyed () {
    // 销毁监听事件
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      // 初始化Echarts实例对象
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      // 初始化配置项
      const initOption = {

      }
      this.chartInstance.setOption(initOption)
    },
    // 请求数据
    getData () {
      this.updateChart()
    },
    // 数据处理
    updateChart () {
      // const centerArr = [
      //   ['18%', '40%'],
      //   ['50%', '40%'],
      //   ['82%', '40%'],
      //   ['34%', '75%'],
      //   ['66%', '75%']
      // ]
      // const colorArr = [
      //   ['#4FF778', '#0BA82C'],
      //   ['#E5DD45', '#E8B11C'],
      //   ['#E8821C', '#E55445'],
      //   ['#5052EE', '#AB6EE5'],
      //   ['#23E5E5', '#2E72BF']
      // ]

      // 数据配置项
      const dataOption = {

      }
      this.chartInstance.setOption(dataOption)
    },
    // 响应式方法
    screenAdapter () {
      // 分辨率文字大小
      // const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6

      const adapterOption = {

      }
      this.chartInstance.setOption(adapterOption)
      // 调用Echarts实例自带 resize方法(响应式/自适应)
      this.chartInstance.resize()
    }

  }
}
</script>

<style lang='less' scoped>
</style>
