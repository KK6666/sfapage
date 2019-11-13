<template>
  <div class="visitShop view">
    <TopHead title="进店拜访" class="header"></TopHead>
    <Tab class="tab" @leftClick="actived = 1" @rightClick="actived = 2">
      <template v-slot:titleL
        >计划内
      </template>
      <template v-slot:titleR>
        计划外
      </template>
    </Tab>
    <div v-show="actived == 1" class="wrap">
      <Search
        v-model="q"
        class="search"
        @handleSearch="handleSearch"
        @inputClear="inputClear"
      ></Search>
      <div id="main" ref="main" class="main">
        <mescroll-vue
          ref="mescroll"
          :up="mescrollUp"
          class="mescroll"
          @init="mescrollInit"
        >
          <ul class="listWrap">
            <router-link
              v-for="item in shopList"
              :key="item.id"
              :to="`/visitshop/${item.id}`"
              class="listItem"
            >
              <ul>
                <li class="top">
                  <span>{{ item.name }}</span>
                  <span>
                    <i class="iconfont">&#xe61f;</i>&lt;{{ item.distance }}米
                  </span>
                </li>
                <li class="middle">{{ `id:${item.id}` }}</li>
                <li class="bottom">{{ item.bossName }}</li>
              </ul>
              <i class="iconfont iR">&#xe84e;</i>
            </router-link>
          </ul>
        </mescroll-vue>
      </div>
    </div>
    <div v-show="actived == 2" class="main right">
      <div>暂无相关数据</div>
    </div>
  </div>
</template>

<script>
import Tab from '../components/Tab'
import Search from '../components/Search'
import service from '../service'
import { Indicator, Toast } from 'mint-ui'
import MescrollVue from 'mescroll.js/mescroll.vue'
import { mapState, mapMutations } from 'vuex'
import Utility from '../common/Utility'
export default {
  name: 'VisitShop',
  components: {
    Tab,
    MescrollVue,
    Search
  },
  data() {
    return {
      inputActive: false,
      q: '',
      pos: null,
      // mescroll相关
      mescroll: null, // mescroll实例对象
      mescrollUp: {
        // 上拉加载的配置.
        auto: false,
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 我是有底线的 --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        // // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        // // 这就是为什么无更多数据有时候不显示的原因
        toTop: {
          //回到顶部按钮
          src: require('@/assets/img/mescroll-totop.png'), //图片路径,默认null,支持网络图
          offset: 1000 //列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: 'main', //父布局的id (1.3.5版本支持传入dom元素)
          // icon: './static/mescroll/mescroll-empty.png', //图标,默认null,支持网络图
          tip: '暂无相关数据' //提示
        }
      },
      hasNext: true,
      actived: 1
    }
  },
  computed: {
    ...mapState({
      shopList: 'shopList'
    })
  },
  created() {},
  mounted() {
    // 定位成功后请求shop数据（getLocation已用promise封装）
    Utility.getLocation()
      .then(pos => {
        this.pos = pos
        this.getData()
      })
      .catch(e => {
        console.log(e)
      })
    // 设置mescroll定位的top值 ,下拉刷新关闭
    this.setMescroll()
  },
  activated() {
    // 注销登录后，不关闭页面，再次登录后打开此页面会出现不加载数据情况，应为keepAlive的问题，手动触发一次加载数据
    if (this.shopList.length === 0) {
      // 定位成功后请求shop数据（getLocation已用promise封装）
      Utility.getLocation()
        .then(pos => {
          this.pos = pos
          this.getData()
        })
        .catch(e => {
          console.log(e)
        })
      // 设置mescroll定位的top值 ,下拉刷新关闭
      this.setMescroll()
    }
  },
  methods: {
    ...mapMutations(['shopListPush', 'emptyShopList']),
    // 当搜索栏请空时，发起一次新的请求，避免页面无有用数据，增强用户体验
    handleSearch() {
      this.getData()
    },
    // 当搜索栏请空时，发起一次新的请求，避免页面无有用数据，增强用户体验
    inputClear() {
      this.getData()
    },
    getData() {
      // pos不存在（即未定位），不可以search
      if (!this.pos) {
        Toast('请先刷新页面重新点位')
        return
      }
      // 搜索前，将数据清空，并且将mescroll的页码归0
      this.emptyShopList()
      this.mescrollUp.page.num = 0
      this.hasNext = true
      // 主动触发上拉加载,注意this.upCallback是无效的。请求数据的axios写在upCallback里面，触发即可发起一次请求
      this.mescroll.triggerUpScroll()
    },
    setMescroll() {
      // mescroll定位top
      this.$refs.mescroll.$el.style.top = this.$refs.main.offsetTop + 'px'
      // mescroll 下拉刷新关闭
      this.mescroll.lockDownScroll(true)
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    upCallback(page, mescroll) {
      console.log('upCallback')
      Indicator.open('请求数据中...')
      service
        .getShops(this.pos.Lng, this.pos.Lat, this.q, page.num)
        // .getShops(1, 1, this.q, page.num)
        .then(res => {
          console.log(res)
          Indicator.close()

          // 模拟搜索没有返回结果的情况（用服务器时删除）
          if (this.q.length >= 3) {
            res.data = []
          }
          /////////////////////////////////////////////////////////////////////

          this.shopListPush(res.data)
          if (res.data.length <= 0 || this.shopList.length >= 60) {
            this.hasNext = false
          }
          // 数据渲染成功后,隐藏下拉刷新的状态,可通过mescroll.endSuccess的第二个参数设置是否还有数据，列表如果无下一页数据,则提示无更多数据
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.length, this.hasNext)
          })
        })
        .catch(e => {
          console.log(e)
          Indicator.close()
          Toast('请求数据失败')
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          mescroll.endErr()
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    })
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteLeave方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next()
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
  .header,
  .tab,
  .search {
    // 如果内容超出页面高度，子元素的flex-shrink默认为1，head设置的高度会缩小，设置为0后不会缩小
    flex-shrink: 0;
  }
  .main {
    // overflow-y: scroll;
    margin-top: px2rem(20);
  }
}
.search {
  margin-top: px2rem(20);
}
.mescroll {
  position: fixed;
  // top: 0;
  bottom: 0;
  height: auto;
  // z-index: 99;
}
.listWrap {
  .listItem {
    height: px2rem(150);
    margin: 0 5%;
    padding: px2rem(15) 0;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    // background: pink;
    ul {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 90%;
      .top {
        height: px2rem(30);
        line-height: px2rem(30);
        font-size: px2rem(30);
        // background: pink;
        display: flex;
        justify-content: space-between;
        i {
          font-size: px2rem(30);
        }
      }
      .middle {
        height: px2rem(25);
        line-height: px2rem(25);
        font-size: px2rem(25);
        // background: pink;
      }
      .bottom {
        height: px2rem(25);
        line-height: px2rem(25);
        font-size: px2rem(25);
        // background: pink;
      }
    }
    .iR {
      font-size: px2rem(30);
      // background: pink;
      width: 10%;
      text-align: right;
    }
  }
}

.right {
  text-align: center;
  padding-top: px2rem(40);
  color: gray;
}
</style>
