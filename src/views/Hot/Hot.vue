<!-- 热销商品图表 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='hot_ref'></div>
    <span class="iconfont arr-left" @click="toLeft">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight">&#xe6ed;</span>
    <span class="cat-name">{{ catName }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 图表实例数据
      chartInstance: null,
      // 请求数据
      allData: null,
      // 当前展示的一级分类数据
      currentIndex: 0
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
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref)
      const initOption = {
        series: [
          {
            type: 'pie'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 请求参数
    async getData () {
      // 请求饼图数据
      const { data: res } = await this.$axios.get('hot')
      // 绑定数据
      this.allData = res
      console.log(res)
      // 动态渲染数据方法
      this.updateChart()
    },
    // 动态渲染数据方法
    updateChart () {
      // 处理图表需要的数据
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      const legenData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const dataOption = {
        legend: {
          data: legenData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 响应式事件
    screenAdapter () {
      // 根据游览器宽度计算对应响应值宽度大小
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        series: [
          {

          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 调用Echarts实例方法(响应式)
      this.chartInstance.resize()
    },
    // 图表切换-左边
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    // 图表切换-右边
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  },
  computed: {
    // 标题
    catName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    }
  }
}
</script>

<style lang='less' scoped>
.arr-left{
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-color: cyan;
}
.arr-right{
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-color: cyan;
}
.cat-name{
  position: absolute;
  left: 80%;
  bottom: 20px;
}
</style>
