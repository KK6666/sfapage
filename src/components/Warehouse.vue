<template>
  <div class="warehouse">
    <ul class="header">
      <li class="left">
        <Check
          :checked="warehouseItem.checked"
          @checkClick="checkClick"
        ></Check>
      </li>
      <li class="right">
        <div class="w-name">{{ warehouseItem.warehouse.reponame }}</div>
        <router-link
          :to="`/cartremark/${shopId}/${warehouseId}`"
          tag="div"
          class="remark"
        >
          备注<i class="iconfont">&#xe601;</i>
        </router-link>
      </li>
    </ul>
    <Goods
      v-for="goodsItem in warehouseItem.goodsArray"
      :key="goodsItem.goods.id"
      class="goods"
      :goods-item="goodsItem"
      :shop-id="shopId"
      :warehouse-id="warehouseId"
    ></Goods>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Check from './Check'
import Goods from './Goods'
export default {
  name: 'Warehouse',
  components: {
    Check,
    Goods
  },
  props: {
    warehouseItem: { type: Object, default: null },
    shopId: { type: Number, default: 0 }
  },
  data() {
    return {
      warehouseId: this.warehouseItem.warehouse.id
    }
  },
  created() {
    console.log(this.warehouseItem)
    console.log('shopId:' + this.shopId)
  },
  methods: {
    ...mapMutations(['changeWarehouseChecked']),
    checkClick() {
      this.changeWarehouseChecked({
        warehouseId: this.warehouseId,
        shopId: this.shopId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warehouse {
  .header {
    height: px2rem(84);
    background-color: #fafafa;
    border-bottom: 1px solid #ccc;
    font-size: px2rem(28);
    display: flex;
    align-items: center;
    .left {
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .remark {
        padding: px2rem(28);
        color: #109d3d;
        display: flex;
        align-items: center;
        i {
          font-size: px2rem(35);
        }
      }
    }
  }
}
</style>
