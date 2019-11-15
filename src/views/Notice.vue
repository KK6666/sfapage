<template>
  <div class="notice view">
    <TopHead title="公告" class="header"></TopHead>
    <div class="main">
      <!--mescroll滚动区域的基本结构-->
      <mescroll-vue
        ref="mescroll"
        :down="mescrollDown"
        :up="mescrollUp"
        class="mescroll"
        @init="mescrollInit"
      >
        <ul class="noticeList">
          <li
            v-for="(item, index) in noticeList"
            :key="index"
            class="noticeItem"
          >
            <router-link :to="`/notice/${item.id}`">
              <div class="noticeWrap">
                <i
                  class="icon iconfont icon-dian"
                  :class="{ readed: item.isRead }"
                ></i>
                <div class="notice-bd">
                  <h3 class="noticeTitle">{{ item.title }}</h3>
                  <p class="noticeDate">{{ item.SubDate }}</p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import '../assets/font/iconfont.css'
import TopHead from '../components/TopHead'
import service from '../service'
import MescrollVue from 'mescroll.js/mescroll.vue'
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
export default {
  name: 'Notice',
  components: {
    TopHead,
    MescrollVue
  },
  data() {
    return {
      latestDate: new Date(),
      earlistDate: new Date(),
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        auto: false,
        callback: this.downCallback
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        // 上拉加载的配置.
        auto: true,
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        htmlNodata: '<p class="upwarp-nodata">-- 我是有底线的 --</p>',
        toTop: {
          //回到顶部按钮
          src: require('@/assets/img/mescroll-totop.png'), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        }
      },
      // 用来给mescroll传递判断是否还有数据
      hasNext: true
    }
  },
  computed: {
    ...mapState({
      noticeList: 'noticeList'
    })
  },
  created() {},
  activated() {
    // 注销登录后，不关闭页面，再次登录后打开此页面会出现不加载数据情况，应为keepAlive的问题，手动触发一次加载数据
    console.log(this.noticeList.length)
    if (this.noticeList.length === 0) {
      console.log('00000')
      this.mescroll.triggerUpScroll()
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter')
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    })
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave')
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next()
  },
  methods: {
    ...mapMutations(['noticeListPush', 'noticeListUnshift']),
    mescrollInit(mescroll) {
      this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      console.log('upCallback')
      service
        .getNotice(this.latestDate, 10, false)
        .then(res => {
          this.noticeListPush(res.data.data.messages.reverse())
          // latestDatee等于公告列表里最晚一条的时间，作为下拉加载之前数据的earlistDate
          this.latestDate = new Date(this.noticeList[0].SubDate)
          if (this.noticeList.length > 200) {
            this.hasNext = false
          }
          // 数据渲染成功后,隐藏下拉刷新的状态,可通过mescroll.endSuccess的第二个参数设置是否还有数据，列表如果无下一页数据,则提示无更多数据
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.data.messages.length, this.hasNext)
          })
        })
        .catch(() => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr()
        })
    },
    downCallback(mescroll) {
      console.log('downCallback')
      console.log(this.earlistDate)
      service
        .getNotice(this.earlistDate, 10, true)
        .then(res => {
          // 没有新的数据了
          if (res.data.data.messages <= 0) {
            return
          }
          this.noticeListUnshift(res.data.data.messages.reverse())
          // earlistDate等于公告列表里最早一条的时间，作为下拉加载之前数据的earlistDate
          this.earlistDate = new Date(
            this.noticeList[this.noticeList.length - 1].SubDate
          )
          this.$nextTick(() => {
            mescroll.endSuccess()
          })
        })
        .catch(e => {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr()
          console.log(e)
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
    // overflow: scroll;
  }
}

.mescroll {
  position: fixed;
  top: px2rem(120);
  bottom: 0;
  height: auto;
}

.noticeList {
  background: white;
  .noticeItem {
    height: px2rem(120);
    padding: px2rem(50) 0 0 px2rem(40);
    border-bottom: px2rem(1) solid #ccc;
    .noticeTitle {
      font-size: px2rem(30);
      color: #000;
      line-height: px2rem(28);
    }
    .noticeDate {
      font-size: px2rem(26);
      color: #666;
      line-height: px2rem(16+34);
    }
    .noticeWrap {
      display: flex;
      i {
        flex: 0 0 px2rem(43);
        color: red;
        line-height: px2rem(20);
        font-size: px2rem(50);
      }
      i.readed {
        color: #ccc;
      }
    }
  }
}
</style>
