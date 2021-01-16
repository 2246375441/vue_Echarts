<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▎' + showTitle }}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{item.text }}
        </div>
      </div>
    </div>
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
      allData: null,
      // 是否显示可选项
      showChoice: false,
      // 标题名 key
      choiceType: 'map',
      // 标题的字体大小
      titleFontSize: 0,
      // 半透明的颜色值
      colorArr1: [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ],
      // 全透明的颜色值
      colorArr2: [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
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
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      // 初始化图表设置配置项
      const initOption = {
        grid: {
          left: '3%',
          right: '4%',
          top: '35%',
          bottom: '1%',
          containLabel: true // 图表定位x,y轴也受影响
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: { // 数据筛选样式控制
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false // 数据从x=0开始
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
      // 半透明的颜色值
      const colorArr1 = this.colorArr1
      // 全透明的颜色值
      const colorArr2 = this.colorArr2
      // x轴月份数据 ['一月','二月'.....]
      const timeArr = this.allData.common.month
      // y轴地区数据 [{type: "line", data: [12,44,55,...], stack: "map",name: "上海",areaStyle: {} },{}....]
      const valueArr = this.allData[this.choiceType].data
      // 处理y轴数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'this.choiceType', // 将样式转换为堆叠图
          areaStyle: { // 颜色填充
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorArr1[index] },
              { offset: 1, color: colorArr2[index] }
            ])
          }
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
      // 设置响应文字宽度
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      // 分辨率适配配置项
      const adapterOption = {
        legend: { // 图例样式
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      // 渲染图表
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 标题点击事件
    handleSelect (currentType) {
      // 更改当前显示地图数据
      this.choiceType = currentType
      // 触发图表重新渲染
      this.updateChart()
      // 关闭标题可选项
      this.showChoice = false
    }
  },
  computed: {
    // 地区分类数据 如果没有请求数据则为[]有数据则为[{},{},{}]
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        // 通过filter过滤 已选项
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    // 标题内容
    showTitle () {
      if (!this.allData) {
        return []
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize / 2 + 'px'
      }
    }
  }
}
</script>

<style scoped lang="less">
.title{
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con{
    background-color: #222733;
    border-radius: 30px;
  }
}

</style>
