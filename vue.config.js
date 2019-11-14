module.exports = {
  css: {
    loaderOptions: {
      sass: {
        //    // 旧
        //      data: `@import "~@/assets/scss/variables.scss";`
        //    // 新
        //      prependData: `@import "~@/assets/scss/variables.scss";`
        prependData: `@import "./src/assets/style/main.scss";`
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8889',
        // target: 'http://yapi.demo.qunar.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
          '^/server': '/server'

          // '^/api': '/mock/2226/api' // rewrite path
        }
      }
    },
    // 可以让eslint警告显示在控制台
    hot: true,
    clientLogLevel: 'warning'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/sfapage/' : '/',
  // 通过外联cdn加载依赖，build时不会打入包中，减小包大小
  configureWebpack: config => {
    config.externals = {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      axios: 'axios'
    }
  }
}
