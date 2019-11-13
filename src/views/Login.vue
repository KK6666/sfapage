<template>
  <div class="login">
    <h1 class="title">欢迎登陆SFA系统</h1>
    <div class="login-con-wrap">
      <div class="login-con-hat"></div>
      <div class="login-main-con">
        <div class="logo-wrap">
          <div class="logo"></div>
        </div>
        <div class="login-input-group">
          <!-- class绑定-对象语法，下面的语法表示 active 这个 class 存在与否将取决于active_index===1 -->
          <!-- errors.has('comNum')———判断错误集合中，name为comNum的input是否有错误，有则返回true -->
          <div
            class="login-input-field"
            :class="{
              active: active_index === 1,
              error: errors.has('comNum')
            }"
          >
            <label for="comNum">公司编码:</label>
            <input
              id="comNum"
              ref="comNum"
              v-model="company_num"
              v-validate="'required|length:4'"
              type="number"
              placeholder="请输入4位数字"
              name="comNum"
              @focus="
                active_index = 1
                $refs.comNum.placeholder = ''
              "
              @blur="$refs.comNum.placeholder = '请输入4位数字'"
            />
            <!-- 显示验证未通过信息 -->
            <!-- <span>{{ errors.first('comNum') }}</span> -->
          </div>
          <div
            class="login-input-field"
            :class="{
              active: active_index === 2,
              error: errors.has('perNum')
            }"
          >
            <label for="perNum">员工编号:</label>
            <input
              id="perNum"
              ref="perNum"
              v-model="person_num"
              v-validate="{ required: true, length: 4 }"
              type="number"
              placeholder="请输入4位数字"
              name="perNum"
              @focus="
                active_index = 2
                $refs.perNum.placeholder = ''
              "
              @blur="$refs.perNum.placeholder = '请输入4位数字'"
            />
          </div>
          <div
            class="login-input-field"
            :class="{ active: active_index === 3, error: errors.has('pwd') }"
          >
            <label for="pwd">登录密码:</label>
            <input
              id="pwd"
              ref="pwd"
              v-model="password"
              v-validate="'required|min:6'"
              type="password"
              placeholder="请输入6位及以上密码"
              name="pwd"
              @focus="
                active_index = 3
                $refs.pwd.placeholder = ''
              "
              @blur="$refs.pwd.placeholder = '请输入6位及以上密码'"
            />
          </div>
        </div>
        <div class="login-option-wrap">
          <div class="remember-pwd" @click="changeRememberStatus">
            <i
              class="iconfont"
              :class="remember ? 'icon-check-square' : 'icon-border'"
            ></i>
            <span>保存密码</span>
          </div>
          <div class="auto-login" @click="changeAutologStatus">
            <i
              class="iconfont"
              :class="autolog ? 'icon-check-square' : 'icon-border'"
            ></i>
            <span>自动登录</span>
          </div>
        </div>
      </div>
    </div>
    <div class="login-btn" @click="handleLogBtnClick">
      <p>登录</p>
    </div>
  </div>
</template>

<script>
import '../assets/font/iconfont.css'
import { Indicator, Toast } from 'mint-ui'
import { mapMutations } from 'vuex'
// axios请求方法全部封装在service
import service from '../service'
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      // 通过active_index改变，给input绑定active的class
      active_index: 0,
      company_num: '',
      person_num: '',
      password: '',
      remember: false,
      autolog: false
    }
  },
  created() {
    // localstorage里的数据赋值给data的属性
    let data = JSON.parse(localStorage.getItem('Login_data'))
    for (let i in data) {
      this[i] = data[i]
    }
    if (this.autolog === true) {
      this.handleLogBtnClick()
    }
    // 注销登录返回登录页面时，路由里有用户信息，显示出来
    if (this.$route.query.PNO) this.person_num = this.$route.query.PNO
    if (this.$route.query.CNO) this.company_num = this.$route.query.CNO
  },
  methods: {
    ...mapMutations([
      // 将 `this.saveUserData()` 映射为 `this.$store.commit('saveUserData')`
      'saveUserData'
    ]),
    // 选择框逻辑：自动登录需同时记住密码，当取消记住密码，自动登录也要取消
    changeRememberStatus() {
      this.remember = !this.remember
      // 当remember为false，让autolog也为false
      this.remember || (this.autolog = false)
    },
    changeAutologStatus() {
      this.autolog = !this.autolog
      this.autolog && (this.remember = true)
    },
    async handleLogBtnClick() {
      // 强制执行一次校验，这里貌似是异步的，如果不写await会直接先执行后面的代码
      await this.$validator.validate()
      // this.errors.any()--errors有数据，即有错误返回true
      if (this.errors.any()) {
        Toast({
          message: '请正确填写信息',
          duration: 1000
        })
      } else {
        Indicator.open('登陆中...')
        service
          .login({
            CNO: this.company_num,
            PNO: this.person_num,
            Passwd: this.password
          })
          .then(res => {
            Indicator.close()
            if (res.data.code === 1) {
              // 登录成功
              // 用户信息存入sessionStorage,可实现长期保存账号密码,实现记住密码自动登录.非常不安全,一般不使用
              if (this.remember) {
                this.setDataToLocalStorage()
              }
              // 用户信息存入sessionStorage，解决vuex在页面刷新后就丢失数据问题
              this.setDataToSessionStorage(res)
              // 用户信息存入vuex
              this.setDataToVuex(res)
              // 跳转至home
              this.$router.push('/home')
            } else {
              // 登录失败
              Toast({
                message: '账号密码错误',
                duration: 1000
              })
            }
          })
          .catch(e => {
            console.log(e)
            Indicator.close()
            Toast({
              message: '登录异常，请重试',
              duration: 1000
            })
          })
      }
    },
    // localStorage会自动将数据转换成为字符串形式，所以我们存储json类型时，可以先用JSON.stringify(data)转成字符串存储，取出时再用JSON.parse()转化为json
    setDataToLocalStorage() {
      localStorage.setItem(
        'Login_data',
        JSON.stringify({
          remember: this.remember,
          autolog: this.autolog,
          company_num: this.remember ? this.company_num : '',
          person_num: this.remember ? this.person_num : '',
          password: this.remember ? this.password : ''
        })
      )
    },
    setDataToSessionStorage(res) {
      sessionStorage.setItem('Login_data', JSON.stringify(res.data.user))
      sessionStorage.setItem('LoginToken', JSON.stringify(res.data.token))
    },
    setDataToVuex(res) {
      this.saveUserData(res.data.user)
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  overflow-x: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #2ade69 !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title {
  color: #fff;
  font-size: px2rem(36);
  text-align: center;
  // padding-top: px2rem(148-40-36);
}
.login-con-wrap {
  margin-top: px2rem(40);
  .login-con-hat {
    width: px2rem(537);
    height: px2rem(18);
    background-color: #eeeeee;
    margin: 0 auto;
    border-radius: px2rem(18) px2rem(18) 0 0;
  }
  .login-main-con {
    width: px2rem(600);
    height: px2rem(736);
    background-color: #fff;
    margin: 0 auto;
    border-radius: px2rem(14);
    .logo-wrap {
      height: px2rem(150);
      padding-top: px2rem(50);
      .logo {
        width: px2rem(150);
        height: px2rem(150);
        background-image: url(../assets/logo.png);
        background-size: cover;
        margin: 0 auto;
      }
    }
    .login-input-group {
      margin-top: px2rem(10);
      .login-input-field {
        width: px2rem(440);
        height: px2rem(90);
        line-height: px2rem(90);
        padding-left: px2rem(30);
        margin: 0 auto;
        font-size: px2rem(28);
        color: #757575;
        border: 2px solid #e2e2e2;
        border-radius: px2rem(40);
        margin-top: px2rem(30);
        input {
          width: px2rem(250);
          padding-left: px2rem(25);
          border: 0 none;
          outline: 0 none;
          font-size: px2rem(28);
        }
        label {
          font-weight: bold;
        }
      }
    }
    .login-input-field.active {
      border: 2px solid #10903d;
      color: #10903d;
    }
    .login-input-field.error {
      border: 2px solid red;
      color: red;
    }
    .login-option-wrap {
      // margin-top: px2rem(45);
      font-size: px2rem(24);
      color: #757575;
      span {
        margin-left: px2rem(15);
        letter-spacing: px2rem(2);
        font-size: px2rem(30);
      }
      i.iconfont {
        font-size: px2rem(30);
      }
      .remember-pwd {
        display: inline-block;
        padding: px2rem(40) 0 px2rem(40) px2rem(90);
      }
      .remember-pwd.active,
      .auto-login.active {
        color: #10903d;
      }
      .auto-login {
        display: inline-block;
        padding: px2rem(40) 0 px2rem(40) px2rem(80);
      }
    }
  }
}
.login-btn {
  width: px2rem(600);
  height: px2rem(100);
  line-height: px2rem(100);
  text-align: center;
  margin: px2rem(20) auto 0;
  color: #10903d;
  background-color: #fff;
  font-size: px2rem(36);
  border-radius: px2rem(15);
  letter-spacing: px2rem(5);
}

// 改变placeHolder颜色
input::-webkit-input-placeholder {
  color: #ccc;
  font-size: px2rem(25);
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ccc;
  font-size: px2rem(25);
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ccc;
  font-size: px2rem(25);
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #ccc;
  font-size: px2rem(25);
}
</style>
