<!-- 热销商品图表 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='hot_ref'></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
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
      currentIndex: 0,
      // 当前分辨率下文字大小
      titleFontSize: 0
    }
  },
  created () {
    this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted () {
    // 初始化实例
    this.initChart()
    // 请求数据函数
    // this.getData()
    this.$socket.send({
      action: 'getData', // 操作类型
      socketType: 'hotData', // 回调函数名字
      chartName: 'hot' // 请求json的文件名
    })
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
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎热销商品销售金额占比图',
          top: 20,
          left: 20
        },
        legend: {
          top: '12%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            // 三级分类数据
            const thirdCategory = arg.data.children
            // 数据排序
            thirdCategory.sort((a, b) => {
              return a.value - b.value
            })
            // 数据总和
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            // 高亮文字设置
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr = retStr + `
              ${item.name} : ${item.value} (${parseInt(item.value / total * 100)}%) </br>
              `
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false // 默认文字和线全部隐藏
            },
            emphasis: {
              label: {
                show: true // 高亮提示文字
              },
              labelLine: {
                show: false // 高亮下隐藏线
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 请求参数
    async getData (ret) {
      // 请求饼图数据
      // const { data: res } = await this.$axios.get('hot')
      // 绑定数据
      // this.allData = res

      // 使用webSocket请求数据
      this.allData = ret

      // 动态渲染数据方法
      this.updateChart()
    },
    // 动态渲染数据方法
    updateChart () {
      // 处理图表需要的数据
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      // legend筛选数据
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const dataOption = {
        legend: {
          data: legendData
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
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 5,
            center: ['50%', '60%']
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
    },
    // 控制css样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
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
  color: white;
}
.arr-right{
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name{
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
