<template>
  <div class="noticeDetail view">
    <TopHead title="公告信息" class="header"></TopHead>
    <div class="main">
      <!-- // axios写在mounted里，执行了mounted之后notice才有内容。如果直接用notice.title,在mounted之前挂载时，notice.title并不存在，会报错 -->
      <h3>{{ notice ? notice.title : '' }}</h3>
      <p>{{ notice ? notice.text : '' }}</p>
    </div>
  </div>
</template>

<script>
import TopHead from '../components/TopHead'
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
import service from '../service'
export default {
  name: 'NoticeDetail',
  components: {
    TopHead
  },
  data() {
    return {
      notice: null
    }
  },
  computed: {
    ...mapState(['noticeList'])
  },
  mounted() {
    const noticeId = this.$route.params.id
    this.notice = this.noticeList.find(item => noticeId == item.id)

    // 服务器设置已读
    service.setNoticeReaded(noticeId)
    // 改变vuex里noticeList数据，设置成已读
    this.setNoticeReaded(noticeId)
  },
  methods: {
    ...mapMutations(['setNoticeReaded'])
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

.main {
  padding: px2rem(20);
  h3 {
    line-height: px2rem(35);
    font-weight: bold;
  }
  p {
    margin-top: px2rem(15);
    line-height: px2rem(30);
    text-indent: px2rem(60);
  }
}
</style>
