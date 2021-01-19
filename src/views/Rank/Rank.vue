<template>
  <div class='com-container'>
    <div class='com-chart' ref='rank_ref'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 图表实例
      chartInstance: null,
      // 图表数据
      allData: null,
      // 图表渐变色
      colorArr: [
        ['#0BA82C', '#4FF778'],
        ['#5052EE', '#AB6EE5'],
        ['#2E72BF', '#23E5E5']
      ],
      // 区域缩放起点值
      startValue: 0,
      // 区域缩放终点值
      endValue: 0,
      // 平移动画定时器
      timerId: null,
      // 平移动画速度
      timeout: 2000,
      // 图表显示多少条数据
      valueNum: 9

    }
  },
  created () {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted () {
    // 数据赋值
    this.endValue = this.valueNum - 1
    // 初始化实例
    this.initChart()
    // 请求图表数据
    // this.getData()
    this.$socket.send({
      action: 'getData', // 操作类型
      socketType: 'rankData', // 回调函数名字
      chartName: 'rank' // 请求json的文件名
    })
    // 监听页面宽度发生变化 触发回调
    window.addEventListener('resize', this.screenAdapter)
    // 手动触发响应式回调
    this.screenAdapter()
  },
  destroyed () {
    // 销毁页面绑定事件
    window.removeEventListener('resize', this.screenAdapter)
    // 销毁定时器
    clearInterval(this.timerId)
  },
  methods: {
    // 初始化实例
    initChart () {
      // 初始化Echarts图表实例
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      // 初始化图表样式配置项
      const initOption = {
        title: {
          text: '▎地区销售排行榜',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: arg => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = 0
                } else if (arg.value > 200) {
                  targetColorArr = 1
                } else {
                  targetColorArr = 2
                }
                // 根据targetColorArr决定返回哪一组渐变色
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: this.colorArr[targetColorArr][0] },
                  { offset: 1, color: this.colorArr[targetColorArr][1] }
                ])
              }
            },
            label: {
              show: true
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 监听鼠标移入图标 暂停平移动画
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 鼠标移除启动定时器动画
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 请求数据
    async getData (ret) {
      // 请求数据 [{name: "广东", value: 230},{}....]
      // const { data: res } = await this.$axios.get('rank')
      // this.allData = res

      // 使用webSocket请求数据
      this.allData = ret

      // 将数据排序
      this.allData.sort((a, b) => {
        return -(a.value - b.value)
      })
      this.updateChart()
      // 启动平移动画
      this.startInterval()
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
        // 平移动画操作
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
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
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        xAxis: {
          axisLabel: {
            fontSize: titleFontSize / 2,
            padding: [5, 0, 0, 0]
          }
        },
        series: [
          {
            barWidth: titleFontSize * 1.2,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 平移动画 通过dataZoom缩放
    startInterval () {
      // 保险措施 防止定时器泄漏
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = this.valueNum - 1
        }
        this.updateChart()
      }, this.timeout)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
