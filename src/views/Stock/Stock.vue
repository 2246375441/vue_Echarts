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
      allData: null,
      // 圆环图颜色设置
      colorArr: [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ],
      // 圆环图坐标位置设置
      centerArr: [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ],
      // 数据页数/更新
      currentIndex: 0,
      // 定时器
      timerId: null,
      // 自动切换间隔
      timeout: 3000
    }
  },
  created () {
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted () {
    // 初始化实例数据
    this.initChart()
    // 请求数据
    // this.getData()
    this.$socket.send({
      action: 'getData', // 操作类型
      socketType: 'stockData', // 回调函数名字
      chartName: 'stock' // 请求json的文件名
    })
    // 监听页面宽度变化
    window.addEventListener('resize', this.screenAdapter)
    // 调用响应式方法
    this.screenAdapter()
  },
  destroyed () {
    // 销毁监听事件
    window.removeEventListener('resize', this.screenAdapter)
    // 销毁定时器
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      // 初始化Echarts实例对象
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
      // 初始化配置项
      const initOption = {
        title: {
          text: '▎库存与销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
      // 监听鼠标移入事件监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 监听鼠标移除事件
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 请求数据
    async getData (ret) {
      // // 请求数据
      // const { data: res } = await this.$axios.get('stock')
      // // 绑定数据
      // this.allData = res
      // this.updateChart()
      // // 启动定时器
      // this.startInterval()

      // 使用webSocket请求数据
      this.allData = ret
      this.updateChart()
      // 启动定时器
      this.startInterval()
    },
    // 数据处理
    updateChart () {
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      // 圆环图中心点坐标
      const centerArr = this.centerArr
      // 圆环图颜色
      const colorArr = this.colorArr
      // 处理图表需要的数据
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // radius: [30, 50],
          center: centerArr[index],
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              name: item.name + '\n' + item.sales,
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ],
          hoverAnimation: false, // 关闭鼠标移入圆环图动画,
          labelLine: {
            show: false // 隐藏指示线
          }
        }
      })
      // 数据配置项
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 响应式方法
    screenAdapter () {
      // 分辨率文字大小
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      // 圆环的 内圆半径和外圆半径
      const innerRadius = titleFontSize * 2
      const outterRadius = titleFontSize * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          { type: 'pie', radius: [outterRadius, innerRadius], label: { fontSize: titleFontSize / 2 } },
          { type: 'pie', radius: [outterRadius, innerRadius], label: { fontSize: titleFontSize / 2 } },
          { type: 'pie', radius: [outterRadius, innerRadius], label: { fontSize: titleFontSize / 2 } },
          { type: 'pie', radius: [outterRadius, innerRadius], label: { fontSize: titleFontSize / 2 } },
          { type: 'pie', radius: [outterRadius, innerRadius], label: { fontSize: titleFontSize / 2 } }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 调用Echarts实例自带 resize方法(响应式/自适应)
      this.chartInstance.resize()
    },
    // 更新动画
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, this.timeout)
    }

  }
}
</script>

<style lang='less' scoped>
</style>
