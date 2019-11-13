<template>
  <div class="view">
    <TopHead title="门店签到" class="header">
      <i slot="r" class="iconfont" @click="submitSigin">&#xe61e;</i>
    </TopHead>
    <div class="main">
      <ul class="picWrap">
        <li>
          <ImgBtn
            icon-class="icon-xiangji"
            val="拍摄照片"
            @btnClick="addPhoto"
          ></ImgBtn>
        </li>
        <li
          v-for="item in imgList"
          :key="item.url"
          class="item"
          @click="item.isChecked = !item.isChecked"
        >
          <div v-if="item.isChecked" class="mask">
            <i class="iconfont">&#xe61e;</i>
          </div>
          <img :src="item.url" />
        </li>
        <li>
          <!-- 在属性前isred加冒号，表示此属性的值是变量或表达式，如果不加，就认为是字符串，所以抛错。 -->
          <ImgBtn
            icon-class="icon-shanchudange"
            val="删除照片"
            :isred="true"
            @btnClick="delPhoto"
          ></ImgBtn>
        </li>
      </ul>
      <!-- // css设置隐藏，用来触发打开文件功能，不需要显示 -->
      <input ref="inputFile" type="file" class="file" @change="filesChange" />
      <p class="warn">
        <span>注意：</span><br />
        此功能需配合后台服务器才能正常显示图片，单独浏览只可展示操作逻辑
      </p>
    </div>
  </div>
</template>

<script>
import ImgBtn from '../components/ImgBtn'
import service from '../service'
import canvasResize from 'canvas-resize'
import Utility from '../common/Utility'
import { Toast } from 'mint-ui'
export default {
  name: 'Sign',
  components: {
    ImgBtn
  },
  data() {
    return {
      imgList: []
    }
  },
  created() {
    // 每次进入页面前，可以在这里先拿到数据，在页面上展示出已提交的照片
  },
  mounted() {},
  methods: {
    addPhoto() {
      // <input type="file">的click事件，可以打开文件夹
      this.$refs.inputFile.click()
    },
    delPhoto() {
      this.imgList = this.imgList.filter(item => item.isChecked == false)
      // 当删除一张图片后，再次上传同一张会无效，因为上传的value值相同，需将value值清空
      this.$refs.inputFile.value = ''
    },
    // 照片文件上传至服务器，并在页面展示（注意：此功能需要后台配合完成）
    filesChange() {
      let formData = new FormData()
      // 拿到当前上传的图片
      let file = this.$refs.inputFile.files[0]
      // 对当前上传的图片file，进行压缩后，callback返回一个base64的字符串
      canvasResize(file, {
        crop: false, // 裁剪参数
        quality: 0.5, // 压缩率， 0-1
        rotate: 0, // 是否旋转
        callback: baseStr => {
          // 返回的base64字符， 转换成Blob数据对象(这里的服务器只能接收二进制数据)
          let fileBlob = Utility.convertBase64UrlToBlob(baseStr, {
            type: file.type
          })
          // 文档要求：请求表单中，文件对应的name必须为： imgF;
          formData.append('imgF', fileBlob)
          service
            .uploadImg(formData)
            .then(res => {
              console.log(res)
              // this.imgList.push(`http://localhost:8889${res.data.img}`)
              // 这里不可以直接用http://localhost:8889，服务器变化时，这个地址也会改变。可以再.env文件里设置变量VUE_APP_BASEURL=http://localhost:8889。当服务器改变时，可以通过改变.env来实现（参考文档vue_cli--环境变量和模式）
              this.imgList.push({
                isChecked: false,
                url: `${process.env.VUE_APP_BASEURL}${res.data.img}`
              })
              // 上传完成清空input的value，可以接着再上传同一张图片
              this.$refs.inputFile.value = ''
              // console.log(this.imgList)
            })
            .catch(e => {
              console.log('uploadImg failed')
              console.log(e)
            })
        }
      })
    },
    // 签到信息提交至服务器
    submitSigin() {
      console.log(this.imgList)
      if (this.imgList.length == 0) {
        Toast({
          message: '请先上传签到照片',
          position: 'middle',
          duration: 2000
        })
        return
      }
      service
        .submitSigin({
          id: Date.now(),
          shopId: this.$route.params.id,
          SubOn: new Date().toLocaleDateString(),
          imgs: this.imgList.map(item => item.url)
        })
        .then(res => {
          console.log(res)
          Toast({
            message: '签到成功！',
            position: 'middle',
            duration: 2000
          })
        })
        .catch(e => {
          console.log(e)
          Toast({
            message: '签到失败！',
            position: 'middle',
            duration: 2000
          })
        })
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
    overflow: scroll;
  }
}

.header {
  i {
    font-size: px2rem(36);
  }
}

.picWrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: px2rem(20);
  .item {
    img {
      width: px2rem(210);
      height: px2rem(210);
    }
  }
  li {
    position: relative;
    margin: 0 px2rem(20) px2rem(20) 0;
    .mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      opacity: 0.6;
      i {
        border-radius: 50%;
        background: #06c;
        position: absolute;
        top: px2rem(5);
        right: px2rem(5);
        width: px2rem(40);
        height: px2rem(40);
        font-size: px2rem(30);
        text-align: center;
        color: white;
      }
    }
  }
}

.file {
  display: none;
}

.warn {
  padding: px2rem(20);
  margin-top: px2rem(50);
  span {
    color: red;
  }
}
</style>
