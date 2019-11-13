<template>
  <ul class="goods">
    <li class="left">
      <Check :checked="goodsItem.checked" @checkClick="checkClick"></Check>
    </li>
    <li class="right">
      <div class="img">
        <img :src="goodsItem.goods.img" />
      </div>
      <div class="content">
        <ul>
          <li class="goods-name">商品: {{ goodsItem.goods.title }}</li>
          <li class="p-c">
            <div class="price">
              价格：<span>{{ getItemPriceTotal }}元</span>
            </div>
            <div class="count">
              <div class="reduce" @click="handleCountAdd(-1)"><div>-</div></div>
              <!--  当value为个位数时，删除不会清空value,而是会变成0？
       因为this.$refs.input.value==''时，mutation会传递0给vuex,因为双向绑定，本组件的input的value会显示0。这里给value加个判断，如果为0就显示'' -->
              <!-- 注意这里正常写v-model，但这里绑定vuex的数据，仅有：value有效，改变goodsItem.count需要手动触发mutation，所以不写v-model也可以 -->
              <input
                ref="input"
                :value="goodsItem.count == 0 ? '' : goodsItem.count"
                type="text"
                @input="inputInput"
                @blur="inputBlur"
              />
              <div class="add" @click="handleCountAdd(1)"><div>+</div></div>
            </div>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import Check from './Check'
import { mapMutations } from 'vuex'
import { Toast } from 'mint-ui'
export default {
  name: 'Goods',
  components: {
    Check
  },
  props: {
    goodsItem: { type: Object, default: null },
    warehouseId: { type: Number, default: 0 },
    shopId: { type: Number, default: 0 }
  },
  data() {
    return {}
  },
  computed: {
    // 计算单价商品总价格
    getItemPriceTotal: function() {
      return this.goodsItem.count * this.goodsItem.goods.monery
    }
  },
  created() {
    console.log('goodsItem')
    console.log(this.goodsItem)
  },
  methods: {
    ...mapMutations(['countAdd', 'countChange', 'changeGoodsChecked']),
    handleCountAdd(num) {
      if (num == 1 && this.$refs.input.value >= this.goodsItem.goods.number) {
        Toast({
          message: `库存仅有${this.goodsItem.goods.number}件`,
          position: 'middle',
          duration: 1000
        })
        this.$refs.input.value = this.goodsItem.goods.number
        return
      }
      if (num == -1 && this.$refs.input.value <= 1) {
        Toast({
          message: '该货物不能减少了呦~',
          position: 'middle',
          duration: 1000
        })
        return
      }
      this.countAdd({
        goodsId: this.goodsItem.goods.id,
        warehouseId: this.warehouseId,
        shopId: this.shopId,
        num: Number(num)
      })
    },
    inputInput() {
      // 控制input只能为正整数
      this.$refs.input.value = this.$refs.input.value.replace(
        /^(0+)|[^\d]+/g,
        ''
      )
      if (this.$refs.input.value >= this.goodsItem.goods.number) {
        Toast({
          message: `库存仅有${this.goodsItem.goods.number}件`,
          position: 'middle',
          duration: 1000
        })
        this.$refs.input.value = this.goodsItem.goods.number
      }

      this.countChange({
        goodsId: this.goodsItem.goods.id,
        warehouseId: this.warehouseId,
        shopId: this.shopId,
        num: Number(this.$refs.input.value)
      })
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
    checkClick() {
      this.changeGoodsChecked({
        goodsId: this.goodsItem.goods.id,
        warehouseId: this.warehouseId,
        shopId: this.shopId,
        goodsItem: this.goodsItem
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.goods {
  height: px2rem(180);
  // padding: 0 px2rem(28);
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .left {
  }
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    .img {
      width: px2rem(124);
      height: px2rem(124);
      margin-right: px2rem(28);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-name {
        margin-bottom: px2rem(20);
      }
      .p-c {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .price {
          span {
            color: red;
          }
        }
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
          input {
            border: 1px solid black;
            width: px2rem(90);
            height: px2rem(47);
            text-align: center;
            border-radius: 5px;
          }
        }
      }
    }
  }
}
</style>
