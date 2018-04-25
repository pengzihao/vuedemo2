//(解决跨域)不会区分生产和开发环境的配置
const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  baseUrl: isPro ? 'http://www.vnshop.cn/api/' : 'api/'
}
