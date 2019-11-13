<template>
  <div class="notice view">
    <TopHead title="公告" class="header"></TopHead>
    <div class="main">
      <Loadmore
        ref="loadmore"
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :auto-fill="true"
      >
        <ul class="noticeList">
          <li v-for="item in noticeList" :key="item.id" class="noticeItem">
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
      </Loadmore>
    </div>
  </div>
</template>

<script>
import '../assets/font/iconfont.css'
import TopHead from '../components/TopHead'
import service from '../service'
import { Loadmore } from 'mint-ui'
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
export default {
  name: 'Notice',
  components: {
    TopHead,
    Loadmore
  },
  data() {
    return {
      allLoaded: false, //数据全部加载完，设置为true，不会再加载数据
      earlistDate: null,
      latestDate: null
    }
  },
  computed: {
    ...mapState({
      noticeList: 'noticeList'
    })
  },
  mounted() {
    // 从noticeDetail返回时，会再此触发mounted，如果noticeList已经有数据了，就不要再发起axios
    if (this.noticeList.length) {
      return
    }
    this.getNotice()
  },
  methods: {
    ...mapMutations(['noticeListPush', 'noticeListUnshift']),
    // 下拉刷新（如果有新数据，需要添加到数据列表noticeList的最前面）
    getNotice() {
      // 最早一条公告时间设为为当前时间，并以当前时间为第一条时间加载
      service.getNotice(new Date(), 15, true).then(res => {
        this.noticeListPush(res.data.data.messages.reverse())
        // earlistDate等于公告列表里最早一条的时间，作为下拉加载之前数据的earlistDate
        this.earlistDate = new Date(
          this.noticeList[this.noticeList.length - 1].SubDate
        )
        // latestDatee等于公告列表里最晚一条的时间，作为下拉加载之前数据的earlistDate
        this.latestDate = new Date(this.noticeList[0].SubDate)
      })
    },
    loadTop() {
      service.getNotice(this.latestDate, 15, false).then(res => {
        this.noticeListUnshift(res.data.data.messages.reverse())
        this.latestDate = new Date(this.noticeList[0].SubDate)
        // 加载数据后需要对组件进行一些重新定位的操作。
        this.$refs.loadmore.onTopLoaded()
      })
    },
    // 上拉加载当前时间之前的数据（如果有数据，需要添加到数据列表noticeList的最后面）
    loadBottom() {
      service.getNotice(this.earlistDate, 15, true).then(res => {
        // 没有新的数据了
        if (res.data.data.messages <= 0) {
          this.allLoaded = true
          return
        }
        this.noticeListPush(res.data.data.messages.reverse())
        this.earlistDate = new Date(
          this.noticeList[this.noticeList.length - 1].SubDate
        )
        // 加载数据后需要对组件进行一些重新定位的操作。
        // ???????这句代码导致了第一次进入时，loadmore组件会整体向上移动一段距离bug,未能解决。
        this.$refs.loadmore.onBottomLoaded()
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
    height: 100%;
  }
}

// sass不能解析>>>属性，这种情况下可以用deep，它是>>>的别名，工作原理相同。
.notice /deep/ .mint-loadmore-top {
  color: #666;
  font-size: px2rem(30);
}
.notice /deep/ .mint-loadmore-text {
  color: #666;
  font-size: px2rem(30);
}

.noticeList {
  background: white;
  .noticeItem {
    height: px2rem(93);
    padding: px2rem(32) 0 0 px2rem(40);
    border-bottom: px2rem(1) solid #ccc;
    .noticeTitle {
      font-size: px2rem(28);
      color: #000;
      line-height: px2rem(28);
    }
    .noticeDate {
      font-size: px2rem(16);
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
