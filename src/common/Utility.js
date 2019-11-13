import { Indicator, Toast } from 'mint-ui'

export default {
  /**
   * 将以base64的图片url数据转换为Blob
   * @param urlData String   用url方式表示的base64图片数据
   * @param type Object { type: "image/png" }
   */
  convertBase64UrlToBlob(urlData, type) {
    var bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], type)
  },

  // 腾讯地图获取设备地理坐标（使用promise封装）
  /* eslint-disable */
  getLocation() {
    Indicator.open('定位中...')
    return new Promise((resolve, reject) => {
      var geolocation = new window.qq.maps.Geolocation(
        '65DBZ-RNYK6-KRWS3-ESEJR-LL5VZ-NCBKQ',
        'myapp'
      )
      geolocation.getLocation(
        position => {
          Indicator.close()
          console.log(position)
          resolve(position)
        },
        () => {
          Indicator.close()
          reject()
          Toast('定位失败，请刷新重试')
          console.log('定位失败')
        }
      )
    })
  }
  /* eslint-disable */
}