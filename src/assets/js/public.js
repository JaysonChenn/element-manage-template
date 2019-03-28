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
  }
}
