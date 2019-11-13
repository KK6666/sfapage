import axios from 'axios'

// 使用githubPage，设置了自定义的header字段，会导致复杂跨域请求，暂时注释掉
//////////////////////////////////////////////////////////////
// 登录完成后的所有的请求必须在 请求的headers中添加token
// 通过axios的拦截器，在请求前拦截添加token
// let axiosInt = axios.interceptors.request.use(
//   function(config) {
//     // 在发送请求之前做些什么
//     let loginToken = sessionStorage.getItem('LoginToken')
//     if (loginToken) {
//       config.headers.Authorization = 'Bearer ' + loginToken
//     }
//     return config
//   },
//   function(error) {
//     // 对请求错误做些什么
//     return Promise.reject(error)
//   }
// )

export default {
  // 登录
  login() {
    // return axios.post('/api/login', data)
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/login.json'
    )
  },
  // 退出
  logout() {
    // axios.interceptors.request.eject(axiosInt)
  },
  // 获取用户进度信息
  getUserProgress() {
    // return axios.get('/api/getUserProgress')
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/getUserProgress.json'
    )
  },
  // 获取公告
  // getNotice(date, limit, isloadelater) {
  //   if (date) {
  //     // 注意这里的date，传过来的date需要时Date原始类型，不能时字符串类型
  //     date = date.getTime()
  //   }
  //   return axios.get('/getNotice.json', {
  //     params: {
  //       date,
  //       limit,
  //       isloadelater
  //     }
  //   })
  // },
  getNotice() {
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/getNotice.json'
    )
  },
  // 设置公告已读
  // setNoticeReaded(id) {
  //   // return axios.post(`/api/auth/notice/${id}`)
  // },
  setNoticeReaded() {
    return axios.get(
      `https://raw.staticdn.net/KK6666/sfapage/dev/public/setNoticeReaded.json`
    )
  },
  // 获取所有店铺,根据设备定位地理坐标获取(q-搜索关键字)
  // getShops(Lng, Lat, q, _page) {
  //   return axios.get(`/api/auth/shop?_limit=10&_order=asc&_sort=distance`, {
  //     params: {
  //       Lng,
  //       Lat,
  //       q,
  //       _page
  //     }
  //   })
  // },
  getShops() {
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/getShops.json'
    )
  },
  // 获取店铺销售进度
  // getShopSales(id) {
  //   // return axios.get(`/api/auth/shopSales/${id}`)
  //   return axios.get('/api/auth/shopSales/' + id)
  // },
  getShopSales() {
    // return axios.get(`/api/auth/shopSales/${id}`)
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/getShopSales.json'
    )
  },
  // 文件上传
  // 请求表单中，文件对应的name必须为： imgF;文件上传限制文件大小： 2M，目前只支持上传一张图片。
  uploadImg(formData) {
    return axios({
      url: '/api/upload',
      method: 'POST',
      headers: {
        // 指定传输数据为二进制数据，例如图片、mp3、文件
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
  },
  // 提交签到
  // submitSigin(data) {
  //   return axios.post('/api/auth/SignIn', data)
  // },
  submitSigin() {
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/submitSigin.json'
    )
  },
  // 获取货物信息
  // getGoods(data) {
  //   return axios.get('/api/auth/goods', {
  //     params: data
  //   })
  // },
  getGoods() {
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/getGoods.json'
    )
  },
  // 获取所有仓库信息
  // getWarehouse() {
  //   return axios.get('/api/auth/warehouse')
  // }
  getWarehouse() {
    return axios.get(
      'https://raw.staticdn.net/KK6666/sfapage/dev/public/getWarehouse.json'
    )
  }
}
