<template>
  <div class="view user">
    <TopHead title="个人信息" class="header"> </TopHead>
    <div class="main">
      <img
        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573725886876&di=3261d3dc3e2b02578512b4ed6413ca9f&imgtype=0&src=http%3A%2F%2Fimg3.qianzhan.com%2Fnews%2F201404%2F28%2F20140428-809d810e3e374304_980x660.jpg"
      />
      <ul class="name">
        <li>员工姓名</li>
        <li>奶茶</li>
      </ul>
      <ul class="tel">
        <li>手机号码</li>
        <li>{{ LoginUser.phone }}</li>
      </ul>
      <ul class="department">
        <li>部门</li>
        <li>{{ LoginUser.department }}</li>
      </ul>
      <div class="last-login">上次登录时间：{{ LoginUser.lastLogin }}</div>
    </div>
    <footer>
      <div @click="logoutClick">退出登录</div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import TopHead from '../components/TopHead'
export default {
  name: 'User',
  components: {
    TopHead
  },
  computed: {
    ...mapState(['LoginUser'])
  },
  created() {},
  methods: {
    ...mapMutations(['cleartUserData']),
    logoutClick() {
      let user = JSON.parse(sessionStorage.getItem('Login_data'))
      console.log(user)
      let CNO = user.CNO
      let PNO = user.PNO
      // let CNO = this.LoginUser.CNO
      // let PNO = this.LoginUser.PNO
      this.cleartUserData()
      localStorage.clear()
      sessionStorage.clear()
      this.$router.push({ name: 'Login', params: { CNO: CNO, PNO: PNO } })
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
    padding-bottom: px2rem(100);
  }
}

.main {
  img {
    width: px2rem(220);
    height: px2rem(220);
    display: block;
    margin: px2rem(56) auto;
    border-radius: 50%;
  }
  ul {
    height: px2rem(110);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 px2rem(28);
    border-top: 1px solid #ccc;
    li:first-child {
      color: #757575;
    }
  }
  .last-login {
    padding: 0 px2rem(28);
    height: px2rem(110);
    line-height: px2rem(110);
    background-color: #fafafa;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
}
footer {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
  border-top: 1px solid #ccc;
  div {
    flex: 1;
    height: px2rem(100);
    line-height: px2rem(100);
    text-align: center;
  }
  div:first-child {
    color: red;
    border-right: 1px solid #ccc;
  }
}
</style>
