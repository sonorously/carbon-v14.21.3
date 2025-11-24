const path = require('path')

module.exports = {
  lintOnSave: false, // 禁用eslint
  // 设定编译输出目录，默认为 'dist'
  outputDir: 'dist',
  // 配置开发服务器
  devServer: {
    port: 8080, // 设置开发服务器端口，按需修改
    proxy: {
      // 在这里配置你的API代理规则，例如：
      '/api': {
        target: 'http://42.193.121.136:22222', // 博文服务器地址
        // target: 'http://192.168.50.32:22222', // 博文本地电脑
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // 配置Webpack
  configureWebpack: {
    resolve: {
      alias: {
        // 设置路径别名，@ 默认指向 publicComponent 目录
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  // 如果你需要基于环境变量或更复杂的Webpack配置，可以使用 chainWebpack
  // chainWebpack: config => {
  //   // 这里可以基于 webpack-chain 的API进行链式配置
  // }
}
