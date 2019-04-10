import router from '@/router/index'

export default {

  /**
   * @description 时间戳转换
   */
  formatDate (timestamp) {
    var date = new Date(timestamp)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() < 10 ? ('0' + date.getDate() + ' ') : date.getDate() + ' '
    var h = date.getHours() < 10 ? ('0' + date.getHours() + ':') : date.getHours() + ':'
    var m = date.getMinutes() < 10 ? ('0' + date.getMinutes() + ':') : date.getMinutes() + ':'
    var s = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
    return Y + M + D + h + m + s
  },

  /**
   * @description 去掉对象里属性值不存在的属性
   */
  removeProperty (object) {
    for (let prop in object) {
      if (object[prop] === '') {
        delete object[prop]
      }
    }
    return object
  },

  /**
   * @description 页面跳转
   */
  toPage (path, params) {
    router.push({
      path: path,
      query: params
    })
  },

  /**
   * @description 路由参数与data中值绑定
   * @param
   * {
   *  param对象中的键值!!其键值必须为工具栏(输入框、选择框、DatePicker等)在data中绑定的值
   *  例: data: { a: '' }
   *      param: { a: this.a }
   * }
   */
  bindRouteParamToData (route, data) {
    if (Object.keys(route).length !== 0) {
      for (let i in route) {
        for (let j in data) {
          if (i === j) {
            data[j] = Number(route[i])
          }
        }
      }
    }
  }
}
