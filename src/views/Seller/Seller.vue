<!--商家销量统计的横向柱状图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Seller',
  data () {
    return {
      // Echarts图表实例
      chartInstance: null,
      // 服务器返回数据存储
      allData: {},
      // 当前显示的页数
      currentPage: 1,
      // 一共有多少页
      totalPage: 0,
      // 定时器标识
      timerId: null,
      // 页数切换时间差
      timeout: 3000,
      // 每页数据条数
      pageItem: 5
    }
  },
  created () {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted () {
    // 初始化Echarts实例对象
    this.initChart()
    // 获取服务器数据
    // this.getData()
    this.$socket.send({
      action: 'getData', // 操作类型
      socketType: 'sellerData', // 回调函数名字
      chartName: 'seller' // 请求json的文件名
    })
    // 监听窗口变化触发
    window.addEventListener('resize', this.screenAdapter)
    // 页面加载完成 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    // 组件销毁时 关闭定时器
    clearInterval(this.timerId)
    // 组件销毁时 注销响应式事件(避免内存泄漏)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    //  初始化Echarts实例对象
    initChart () {
      const Dom = this.$refs.seller_ref
      // 生成Echarts实例对象 保存在data中
      this.chartInstance = this.$echarts.init(Dom, 'chalk')
      // 和图表初始化样式的配置项
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              /**
               * 改变渐变色,传入参数x1,y1,x2,y2,[{offset:0,color:'颜色'},{offset:1,color:'颜色'}]
               * this.$echarts.graphic.LinearGradient(x1,y1,x2,y2,[{},{}])
               * 方法一
               * */
              // color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              //   { offset: 0, color: '#5052EE' },
              //   { offset: 1, color: '#AB6EE5' }
              // ])
              /**
               * 方法二
               * */
              color: {
                type: 'linear', // 渐变
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#5052EE' },
                  { offset: 1, color: '#AB6EE5' }
                ]
              }
            }
          }
        ]
      }
      // 渲染图标(不包含数据)
      this.chartInstance.setOption(initOption)
      // 监听鼠标移入图表 清除定时器
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 监听鼠标移除图表 重新启动定时器
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    //  获取服务器数据
    async getData (ret) {
      // 请求路径 http://127.0.0.1:8888/api/seller
      // const { data: res } = await this.$axios.get('seller')
      // this.allData = res

      // 使用webSocket请求数据
      this.allData = ret

      // 对数据数据进行排序
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      // 对数据进行分页处理 每5个元素分为一页 计算出一共有多少页数
      if (this.allData.length % 5 === 0) {
        this.totalPage = this.allData.length / 5
      } else {
        this.totalPage = this.allData.length / 5 + 1
      }
      // 更新图表
      this.updateChart()
      // 启动定时器,每隔一定时间 使页数+1
      this.startInterval()
    },
    //  更新图表
    updateChart () {
      // 分页获取数据(前端分页,数据后端全部返回,通过start,end和slice()决定返回数据条数)
      const start = (this.currentPage - 1) * this.pageItem
      const end = this.currentPage * this.pageItem
      // slice() 截取返回一个新数组,不包括end索引值元素
      const showData = this.allData.slice(start, end)
      // 从服务器数据中 取出所有商家名称 返回到一个数组中
      const sellerNames = showData.map((item) => {
        return item.name
      })
      // 从服务器数据中 取出所有商家名称对应数据 返回到一个数组中
      const sellerValue = showData.map((item) => {
        return item.value
      })
      // 和数据相关的配置项
      const dataOption = {
        yAxis: {
          // 数据要求 :['aa','bb','cc]
          data: sellerNames
        },
        series: [
          {
            data: sellerValue
          }
        ]
      }
      // 渲染图表
      this.chartInstance.setOption(dataOption)
    },
    //  页数自动增加(通过定时器添加)
    startInterval () {
      // 安全保障,每当触发函数 优先判断定时器是否存在,存在则销毁
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      // 启动定时器 每隔一段时间 使currentPage+1 页数加一
      this.timerId = setInterval(() => {
        this.currentPage++
        // 当页数超过总页数时 将页数恢复为1
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, this.timeout)
    },
    // 当浏览器大小发生变化会触发事件(响应事件)
    screenAdapter () {
      // 当前浏览器窗口宽度
      const windowWidth = this.$refs.seller_ref.offsetWidth
      const titleFontSize = windowWidth / 100 * 3.6
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      // 渲染图表
      this.chartInstance.setOption(adapterOption)
      // 响应式必须调用resize()方法,不然无法产生效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
