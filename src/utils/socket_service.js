export default class SocketService {
  /**
   * 单例设计模式
   * */
  static instance = null
  // 在Instance前面加上了get 所以调用的时候不需要() 直接SocketService.Instance
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务器连接的socket对象
  ws = null
  // 存储回调函数
  callBackMapping = {}

  // 定义连接服务器的方法
  connect () {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的游览器不支持webSocket')
    }
    this.ws = new WebSocket('ws://127.0.0.1:9001')

    // 连接成功的事件
    this.ws.onopen = () => {
      console.log('连接服务端成功')
    }
    // 连接服务端失败
    this.ws.onclose = () => {
      console.log('连接服务器失败')
    }
    // 得到服务端发送过来的数据
    this.ws.onmessage = msg => {
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        // 判断当前数据时 请求数据 还是全屏操作等等
        if (action === 'getData') {
          // 取出服务端返回的数据data将其转换为json对象
          const realData = JSON.parse(recvData.data)
          // 调用回调函数(传入服务器返回的图表数据)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {

        } else if (action === 'themeChange') {

        }
      }
    }
  }

  // 注册函调函数
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  // 取消回调函数
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法(发送请求,等服务器返回数据之后 触发onmessage去接受数据,根据类型等 去触发对应的回调函数)
  send (data) {
    this.ws.send(JSON.stringify(data))
  }
}
