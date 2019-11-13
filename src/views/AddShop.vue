<template>
  <div class="view">
    <TopHead title="新增门店" class="header">
      <div slot="r" @click="confirmClick">确定</div>
    </TopHead>
    <div class="main">
      <div ref="map" class="map"></div>

      <ul class="wrap">
        <li class="address">地址：{{ address }}</li>
        <li class="name">
          <div>门店名称</div>
          <input ref="name" type="text" placeholder="请填写门店名称" />
        </li>
        <li class="area">
          <div>门店面积</div>
          <input ref="area" type="text" placeholder="请填写门店面积" />
        </li>
        <li class="leader">
          <div>门店店长</div>
          <input ref="leader" type="leader" placeholder="请填写店长姓名" />
        </li>
        <li class="tel">
          <div>联系电话</div>
          <input ref="tel" type="text" placeholder="请填写联系电话" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Utility from '../common/Utility'
import imgl from '../assets/img/marker.png'
import { Toast } from 'mint-ui'
export default {
  name: 'AddShop',
  data() {
    return {
      address: ''
    }
  },
  created() {},
  mounted() {
    this.getMap()
  },
  methods: {
    getMap() {
      //  定位（getLocation已用promise封装）
      Utility.getLocation()
        .then(pos => {
          this.initMap(pos)
        })
        .catch(e => {
          console.log(e)
        })
    },
    /* eslint-disable */
    initMap(pos) {
      // 地图的中心地理坐标
      let center = new qq.maps.LatLng(pos.lat, pos.lng)
      // 创建地图
      var map = new qq.maps.Map(this.$refs.map, {
        center,
        zoom: 13, // 地图缩放级别
        mapStyleId: 'style1' // 该key绑定的style1对应于经典地图样式，若未绑定将弹出无权限提示窗
      })
      // 创建标注
      var marker = new qq.maps.Marker({
        position: center,
        map: map
      })
      var anchor = new qq.maps.Point(0, 39),
        size = new qq.maps.Size(42, 68),
        origin = new qq.maps.Point(0, 0),
        markerIcon = new qq.maps.MarkerImage(imgl, size, origin, anchor)
      marker.setIcon(markerIcon)

      // 获取坐标位置的辅助api
      let geocoder = new qq.maps.Geocoder()
      // 设置获取位置成功之后的回调函数
      geocoder.setComplete(result => {
        // map.setCenter(result.detail.location);
        // 设置当前标注新坐标。
        marker.setPosition(result.detail.location) // 地址坐标
        this.address = result.detail.address // 地址文字
      })

      // 获取地图坐标的 地址位置。
      geocoder.getAddress(center)

      qq.maps.event.addListener(map, 'click', event => {
        center = new qq.maps.LatLng(
          event.latLng.getLat(),
          event.latLng.getLng()
        )
        // map.setCenter(center);
        marker.setPosition(center)
        geocoder.getAddress(center)
      })
    },
    /* eslint-disable */
    confirmClick() {
      // 简单校验：不为空就通过
      if (
        !this.$refs.name.value ||
        !this.$refs.area.value ||
        !this.$refs.leader.value ||
        !this.$refs.tel.value
      ) {
        Toast({
          message: '请填写完整信息',
          position: 'middle',
          duration: 1000
        })
        return
      }
      // axios
      Toast({
        message: '添加成功',
        position: 'middle',
        duration: 500
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
// 页面实现header固定，main单独实现滑动
.view {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  .header {
    // TopHead的父组件（也就是整个页面）会全部使用flex布局，如果内容超出页面高度，子元素的flex-shrink默认为1，head设置的高度会缩小，设置为0后不会缩小
    flex-shrink: 0;
  }
  .main {
    overflow-y: scroll;
  }
}

.map {
  width: 100%;
  height: px2rem(500);
}

.wrap {
  .address {
    padding: 0 px2rem(40);
    background-color: #fafafa;
  }
  li {
    height: px2rem(100);
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    div {
      width: px2rem(160);
      padding-left: px2rem(40);
    }
    input {
      height: px2rem(50);
      padding: px2rem(20) 0;
      flex: 1;
      border: none;
      padding-right: px2rem(40);
    }
  }

  .active {
    color: red;
    font-weight: bold;
  }

  // 改变placeHolder颜色
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc;
  }
  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc;
  }
  input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #ccc;
  }
}
</style>
