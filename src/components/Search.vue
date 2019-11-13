<template>
  <!-- Search组件说明 -->
  <!-- 如下可直接复制到父组件使用，注释需修改 -->
  <!-- 
    // v-model="q"等价于 :
    //   :value="q"
    //   @input="input"       
    //   method:{
    //     input(){
    //         q=$event.target.value
    //     }
    //   }
    // 自定义组件双向绑定（第二步）：
    // 父组件触发input事件，将子组件传递来的$event.target.value赋值给q，完成组向父组件的数据流
    // 自定义组件双向绑定（第三步）： 
    // 将绑定了q值的属性命名为value，传递给子组件（Search）的props
    
    <Search
      v-model="q"
      class="search"
      @inputInput="inputInput"
      @inputFocus="inputFocus"
      @inputBlur="inputBlur"
      @inputClear="inputClear" 
      @inputChange="inputChange"
      @keyupEnter="keyupEnter"
      @handleSearch="handleSearch"
    ></Search>  

    methods: {
    inputInput(value) {
      console.log('inputInput')
    },  
    inputFocus() {
      console.log('inputFocus')
    },
    inputBlur() {
      console.log('inputBlur')
    },
    inputClear() {
      console.log('inputClear')
    },
    // input的value变化后，触发keyupEnter/blur后才触发 
    inputChange() {
      console.log('inputChange')
    },
    handleSearch() {
      console.log('handleSearch')
    },
    // input的value每次变化都会触发，可以在这写节流方法
    inputValChange() {
      console.log('inputValChange')
    },
    keyupEnter() {
      console.log('keyupEnter')
    }
  }
  -->

  <div class="searchWrapper">
    <div class="wrapperL">
      <i class="iconfont">&#xe615;</i>
      <!-- 
        自定义组件双向绑定（第一步）：
          @input="$emit('input', $event.target.value)
          子组件的input触发input事件时，向父组件发起命名为input的事件，参数为$event.target.value（子组件的input当前的value值）

        自定义组件双向绑定（第五步）：
          :value="value"
          将input的value值设置为父组件传递来的属性value的值，完成父组件向子组件的数据流
      -->
      <input
        ref="input"
        :value="value"
        type="text"
        placeholder="请输入搜索内容"
        @input="
          $emit('input', $event.target.value)
          $emit('inputInput')
          inputInput()
        "
        @focus="
          inputFocus()
          $emit('inputFocus')
        "
        @blur="
          inputBlur()
          $emit('inputBlur')
        "
        @change="$emit('inputChange')"
        @keyup.enter="
          $emit('handleSearch')
          $emit('keyupEnter')
        "
      />
    </div>
    <div v-show="inputActive" class="wrapperR">
      <i
        class="iconfont cancel"
        @click="
          inputClear()
          $emit('inputClear')
        "
        >&#xe63a;</i
      >
      <div class="line"></div>
      <div class="searchText" @click="$emit('handleSearch')">
        搜索
      </div>
    </div>
    <!-- <div v-show="!inputActive" class="fnWrapper"></div> -->
  </div>
</template>

<script>
export default {
  name: 'VisitShop',
  props: {
    // 自定义组件双向绑定（第四步）： 接收父组件传递来的名称为value的属性（非input的value）
    value: { type: String, default: '' }
  },
  data() {
    return {
      inputActive: false
    }
  },
  methods: {
    inputFocus() {
      this.$refs.input.placeholder = ''
    },
    inputBlur() {
      this.$refs.input.placeholder = '请输入搜索内容'
    },
    inputClear() {
      this.$emit('input', '')
      this.inputActive = false
    },
    inputInput() {
      if (this.$refs.input.value) {
        this.inputActive = true
      } else {
        this.inputActive = false
        this.$emit('inputClear')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchWrapper {
  border: 2px solid #ccc;
  height: px2rem(80);
  // background: #fafafa;
  width: 94%;
  margin-left: 3%;
  border-radius: px2rem(10);
  overflow: hidden;
  display: flex;
  .wrapperL {
    flex: 1;
    display: flex;
    i {
      font-size: px2rem(40);
      width: px2rem(80);
      height: 100%;
      line-height: px2rem(80);
      text-align: center;
      color: #ccc;
      // background: red;
    }
    input {
      flex: 1;
      height: 100%;
      line-height: px2rem(80);
      border: none;
      font-size: px2rem(30);
      // background: #fafafa;
      // background: orange;
    }
  }
  .wrapperR {
    display: flex;
    align-items: center;
    .searchText {
      width: px2rem(100);
      text-align: center;
      line-height: px2rem(80);
      font-size: px2rem(30);
      color: black;
      // background: yellow;
    }
    .line {
      height: 50%;
      border: 1px solid #ccc;
    }
    .cancel {
      font-size: px2rem(30);
      height: 100%;
      line-height: px2rem(80);
      width: px2rem(80);
      text-align: center;
      color: #ccc;
      // background: pink;
    }
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
