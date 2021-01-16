<template>
  <div class='com-container'>
    <div class='com-chart' ref='rank_ref'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null
    }
  },
  mounted () {
    // 初始化实例
    this.initChart()
    // 请求图表数据
    this.getData()
    // 监听页面宽度发生变化 触发回调
    window.addEventListener('resize', this.screenAdapter)
    // 手动触发响应式回调
    this.screenAdapter()
  },
  destroyed () {
    // 销毁页面绑定事件
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化实例
    initChart () {
      // 初始化Echarts图表实例
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref)
      // 初始化图表样式配置项
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 请求数据
    async getData () {
      // 请求数据 [{name: "广东", value: 230},{}....]
      const { data: res } = await this.$axios.get('rank')
      // 将数据排序
      res.sort((a, b) => {
        return a.value - b.value
      })
      this.allData = res
      this.updateChart()
    },
    // 图表渲染触发事件
    updateChart () {
      // 处理x轴数据(所有省份形成的数组)
      const provinceArr = this.allData.map(item => {
        return item.name
      })
      // 处理y轴数据(所有省份对应的销售金额)
      const valueArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr // 省份
        },
        series: [
          {
            data: valueArr // 省份对应销售金额
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 页面响应式触发回调
    screenAdapter () {
      // const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang='less' scoped>
</style>
