<template>
  <!-- Count组件说明 -->
  <!-- 
    父组件使用:
    max为输入数字的最大值，超出提醒，且限制输入无效

    <Count v-model="count" :max="111"></Count> 

    data() {
      return {
        count: 1
      }
    }
  -->

  <div class="count">
    <div class="reduce" @click="countReduce"><div>-</div></div>
    <!--  当value为个位数时，删除不会清空value,而是会变成0？
       因为this.$refs.input.value==''时，emit会传递0给父组件,因为双向绑定，本组件的input的value会显示0。这里给value加个判断，如果为0就显示'' -->
    <input
      ref="input"
      :value="value == 0 ? '' : value"
      type="text"
      @input="inputInput"
      @blur="inputBlur"
    />
    <div class="add" @click="countAdd"><div>+</div></div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  name: 'Count',
  props: {
    value: { type: Number, default: 1 },
    max: { type: Number, default: 1 }
  },
  data() {
    return {}
  },
  methods: {
    countAdd() {
      if (this.$refs.input.value >= this.max) {
        Toast({
          message: `库存仅有${this.max}件`,
          position: 'middle',
          duration: 1000
        })
        return
      }
      // 这里不需要修改value值，因为emit触发的input会使得父组件的value绑定的属性改变，而改变后的value会通过props传递回来，导致本组件的input的value值改变
      this.$emit('input', ++this.$refs.input.value)
    },
    countReduce() {
      if (this.$refs.input.value <= 1) {
        Toast({
          message: '该货物不能减少了呦~',
          position: 'middle',
          duration: 1000
        })
        return
      }
      this.$emit('input', --this.$refs.input.value)
    },
    inputBlur() {
      if (this.$refs.input.value == '') {
        Toast({
          message: '最少1件呦~',
          position: 'middle',
          duration: 1000
        })
        this.$refs.input.value = 1
      }
      this.$emit('input', Number(this.$refs.input.value))
    },
    inputInput() {
      // 控制input只能为正整数
      this.$refs.input.value = this.$refs.input.value.replace(
        /^(0+)|[^\d]+/g,
        ''
      )

      console.log(this.$refs.input.value)
      // if (this.$refs.input.value == '') {
      //   return
      // }
      if (this.$refs.input.value > this.max) {
        Toast({
          message: `库存仅有${this.max}件`,
          position: 'middle',
          duration: 1000
        })
        this.$refs.input.value = this.max
      }
      this.$emit('input', Number(this.$refs.input.value))
    }
  }
}
</script>

<style lang="scss" scoped>
// .count {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: px2rem(220);
//   text-align: center;
//   div {
//     border: 1px solid black;
//     width: px2rem(47);
//     height: px2rem(47);
//     // padding: px2rem(28);
//   }
//   input {
//     border: 1px solid black;
//     width: px2rem(90);
//     height: px2rem(47);
//     text-align: center;
//     border-radius: 5px;
//   }
// }

.count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // width: px2rem(220);
  text-align: center;
  .add,
  .reduce {
    padding: px2rem(18);
    div {
      border: 1px solid black;
      width: px2rem(47);
      height: px2rem(47);
    }
  }
  .add {
    // padding-right: px2rem(18);
  }
  input {
    border: 1px solid black;
    width: px2rem(90);
    height: px2rem(47);
    text-align: center;
    border-radius: 5px;
  }
}
</style>
