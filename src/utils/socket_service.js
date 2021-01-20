export default class SocketService {
  /**
   * 单例设计模式
   * 思路
   * 先SocketService.Instance.connect()连接ws服务器
   * 通过registerCallBack(回调函数key,回调函数)注册对应的回调函数
   * 在销毁组件的生命周期中 调用unRegisterCallBack(回调函数key)
   * 通过SocketService.Instance.send({})对ws服务器发送请求
   * 此时ws服务器会返回数据给 客户端 通过onmessage调用callBackMapping中对应的回调函数
   *
   * */
  static instance = null
  // 在Instance前面加上了get 所以调用的时候不需要() 直接SocketService.Instance
  // 不需要通过new去生成实例对象 直接调用Instance即可
  static get Instance () {
    // 判断this中是否有SocketService的实例对象
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 服务器连接的webSocket的实例对象
  ws = null
  // 存储回调函数
  callBackMapping = {}
  // 标识服务器是否连接成功
  connected = false
  // 记录重试发送的次数||处理发送数据失败,重新发送
  sendRetryCount = 1
  // 重新连接服务器的次数||处理发送数据失败,重新连接服务器
  connectRetryCount = 1

  // 定义连接服务器的方法
  connect () {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的游览器不支持webSocket')
    }
    this.ws = new WebSocket('ws://127.0.0.1:9001')

    // 连接成功的事件
    this.ws.onopen = () => {
      this.connected = true
      this.connectRetryCount = 1
      console.log('连接webSocket服务端成功')
    }
    // 连接服务端失败
    this.ws.onclose = () => {
      this.connected = false
      // 自动重连
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500)
      console.log('连接webSocket服务器失败')
    }
    // 得到服务端发送过来的数据,需要先通过send发送对应数据请求 然后才会触发这里 处理回调函数
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
          this.callBackMapping[socketType].call(this, recvData)
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
    // 判断服务器是否连接成功,如果没有连接成功就发送send请求 会发生报错
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      setTimeout(() => {
        this.sendRetryCount++
        this.ws.send(JSON.stringify(data))
      }, this.sendRetryCount * 500)
    }
  }
}
