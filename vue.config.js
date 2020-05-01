module.exports = {
  devServer: {
    proxy: {
      //配置跨域
      '/api': {
        target: 'http://saas.yjshangmao.com/',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
