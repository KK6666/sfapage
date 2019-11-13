import Vue from 'vue'
import Vuex from 'vuex'
// 保证vuex在页面刷新不会清空
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

let userData = sessionStorage.getItem('Login_data')
  ? JSON.parse(sessionStorage.getItem('Login_data'))
  : null

export default new Vuex.Store({
  state: {
    LoginUser: userData,
    noticeList: [],
    shopList: [],
    goods: [],
    curOrderShop: null,
    curOrderWarehouse: null,
    curOrderGoods: null,
    warehouseList: null,
    cartList: []
  },
  mutations: {
    saveUserData(state, userData) {
      state.LoginUser = userData
    },
    cleartUserData(state) {
      state.LoginUser = userData
      state.noticeList = []
      state.shopList = []
      state.goods = []
      state.curOrderShop = null
      state.curOrderWarehouse = null
      state.curOrderGoods = null
      state.warehouseList = null
      state.cartList = []
    },
    // noticeList数组push数据
    noticeListPush(state, data) {
      state.noticeList.push(...data)
    },
    // noticeList数组unshift数据
    noticeListUnshift(state, data) {
      state.noticeList.unshift(...data)
    },
    // 设置公告已读
    setNoticeReaded(state, id) {
      const index = state.noticeList.findIndex(item => item.id == id)
      state.noticeList[index].isRead = true
    },
    // shopList数组push数据
    shopListPush(state, data) {
      state.shopList.push(...data)
    },
    // 清空shopList数组
    emptyShopList(state) {
      state.shopList = []
    },
    // goods数组push数据
    goodsPush(state, data) {
      state.goods.push(...data)
    },
    // 清空goods数组
    emptyGoods(state) {
      state.goods = []
    },
    // 将当前下订单门店信息存入vuex（在shopInfo组件完成）
    initCurOrderShop(state, data) {
      state.curOrderShop = data
    },
    // 将当前下订单仓库信息存入vuex（在goodsSelect组件完成）
    initCurOrderWarehouse(state, data) {
      state.curOrderWarehouse = data
    },
    // 将当前下订单货物信息存入vuex（在goodsSelect组件完成）
    initCurOrderGoods(state, data) {
      state.curOrderGoods = data
    },
    // 将所有仓库信息存入vuex
    initWarehouseList(state, data) {
      state.warehouseList = data
    },
    countAdd(state, data) {
      // 通过当前货物的门店/仓库，定位该货物
      let shop = state.cartList.find(item => item.shop.id == data.shopId)
      let warehouse = shop.warehouseArray.find(
        item => item.warehouse.id == data.warehouseId
      )
      let goods = warehouse.goodsArray.find(
        item => item.goods.id == data.goodsId
      )
      goods.count += data.num
    },

    // 购物车添加数据
    addToCartList(state, data) {
      // cartList结构：
      // [
      //   {
      //     // 门店信息
      //     shop1: xx,
      //     checked: false,
      //     // 该门店涉及所有的仓库信息
      //     warehouseArray: [
      //       {
      //         warehouse1: xx,
      //         remark: '',
      //         checked: false,
      //         // 该仓库涉及的货物信息
      //         goodsArray: [
      //           {
      //             goods1: xx,
      //             checked: false,
      //             count: xx
      //           },
      //           {
      //             goods2: xx
      //           }
      //         ]
      //       },
      //       {
      //         warehouse2: xx,
      //         ....
      //       }
      //     ]
      //   },
      //   {
      //     shop2: theShop,
      //     checked: false,
      //     warehouseArray: [
      //       {
      //         warehouse: theWarehouse,
      //         remark: '',
      //         checked: false,
      //         goodsArray: [
      //           {
      //             checked: false,
      //             goods: theGoods,
      //             count: data.count
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ]
      let theShop = state.curOrderShop
      let theWarehouse = state.curOrderWarehouse
      let theGoods = state.curOrderGoods

      // 在cartList里查找当前门店的索引值
      let theShop_index = state.cartList.findIndex(
        item => item.shop.id == theShop.id
      )
      if (theShop_index < 0) {
        // 当前下单门店在cartList的索引值小于0（即当前门店在cartList不存在），新增一项完整门店/仓库/货物信息
        console.log('当前下单门店不存在')
        state.cartList.push({
          shop: theShop,
          checked: false,
          warehouseArray: [
            {
              warehouse: theWarehouse,
              remark: '',
              checked: false,
              goodsArray: [
                {
                  checked: false,
                  goods: theGoods,
                  count: data.count
                }
              ]
            }
          ]
        })
      } else {
        // 当前下单门店已存在
        console.log('当前下单门店已存在')
        // 在cartList当前门店的一项内查找是否存在当前仓库
        // theShop_w:当前门店下的仓库Array
        let shop = state.cartList[theShop_index]
        let theShop_w = shop.warehouseArray
        // let theShop_w = state.cartList[theShop_index].warehouseArray
        let theWarehouse_index = theShop_w.findIndex(
          item => item.warehouse.id == theWarehouse.id
        )
        if (theWarehouse_index < 0) {
          // 当前仓库在当前门店内不存在，当前门店下新增一项仓库/货物信息
          console.log('当前门店下的当前仓库不存在')
          theShop_w.push({
            warehouse: theWarehouse,
            remark: '',
            checked: false,
            goodsArray: [
              {
                checked: false,
                goods: theGoods,
                count: data.count
              }
            ]
          })
        } else {
          console.log('当前门店下的当前仓库已存在')
          // 在当前门店的当前仓库里查找是否存在当前货物
          // theShop_w_g:当前门店下的当前仓库的货物Array
          console.log(theShop_w[theWarehouse_index].goodsArray)
          let theShop_w_g = theShop_w[theWarehouse_index].goodsArray
          let theGoods_index = theShop_w_g.findIndex(
            item => item.goods.id == theGoods.id
          )
          if (theGoods_index < 0) {
            // 当前仓库在当前门店内不存在，当前门店的当前仓库下新增一项货物信息
            console.log('当前门店下的当前仓库的当前货物不存在')
            theShop_w_g.push({
              checked: false,
              goods: theGoods,
              count: data.count
            })
          } else {
            console.log('当前门店下的当前仓库的当前货物已存在--增加count')
            console.log(theShop_w_g[theGoods_index])
            theShop_w_g[theGoods_index].count += data.count
            // 当增加count后超出库存，变为最大库存
            if (
              theShop_w_g[theGoods_index].count >
              theShop_w_g[theGoods_index].goods.number
            ) {
              theShop_w_g[theGoods_index].count =
                theShop_w_g[theGoods_index].goods.number
            }
          }
        }
      }
    },
    countChange(state, data) {
      // 通过当前货物的门店/仓库，定位该货物
      // let shop = state.cartList.find(item => item.shop.id == data.shopId)
      // let warehouse = shop.warehouseArray.find(
      //   item => item.warehouse.id == data.warehouseId
      // )
      // let goods = warehouse.goodsArray.find(
      //   item => item.goods.id == data.goodsId
      // )
      // goods.count = data.num
      data.goodsItem.checked = !data.goodsItem.checked
    },
    // 改变goods的checked
    changeGoodsChecked(state, data) {
      // 通过当前货物的门店/仓库，定位该货物
      let shop = state.cartList.find(item => item.shop.id == data.shopId)
      let warehouse = shop.warehouseArray.find(
        item => item.warehouse.id == data.warehouseId
      )
      let goods = warehouse.goodsArray.find(
        item => item.goods.id == data.goodsId
      )
      goods.checked = !goods.checked
      // ？？注意： 这里data.goodsItem就是需要修改checked的对象，上面找到的goods跟data.goodsItem是同一指向的对象，直接改goodsItem也可以实现响应式修改，但是可能会有坑，所以还是老老实实按照mutation修改state的数据

      //  货物checked改变为true时，检测所属仓库内其他货物是否有为false的，如果没有，说明已全部选中，将仓库的checked变为true
      if (goods.checked) {
        let goodsFalse = warehouse.goodsArray.find(
          goods => goods.checked == false
        )
        if (!goodsFalse) {
          warehouse.checked = true
          // 检测兄弟仓库是否全选中，如全选中则shop选中
          let warehouseFalse = shop.warehouseArray.find(
            warehouse => warehouse.checked == false
          )
          if (!warehouseFalse) {
            shop.checked = true
          }
        }
      } else {
        // 该货物未选中，则下属所属warehouse，shop未选中
        warehouse.checked = false
        shop.checked = false
        console.log('shop.checked--' + shop.checked)
      }
    },
    // 改变warehouse的checked
    changeWarehouseChecked(state, data) {
      // 定位该仓库
      let shop = state.cartList.find(item => item.shop.id == data.shopId)
      let warehouse = shop.warehouseArray.find(
        item => item.warehouse.id == data.warehouseId
      )
      warehouse.checked = !warehouse.checked

      if (warehouse.checked) {
        // 该仓库选中，则下属货物全选中
        warehouse.goodsArray.forEach(item => (item.checked = true))

        // 检测兄弟仓库是否全选中，如全选中则shop选中
        let warehouseFalse = shop.warehouseArray.find(
          warehouse => warehouse.checked == false
        )
        if (!warehouseFalse) {
          shop.checked = true
        }
      } else {
        // 该仓库未选中，则下属货物全未选中,所属shop未选中
        warehouse.goodsArray.forEach(item => (item.checked = false))
        shop.checked = false
      }
    },
    //全选点击
    allCheckedClick(state, data) {
      let shop = state.cartList.find(item => item.shop.id == data.shopId)
      shop.checked = !shop.checked
      if (shop.checked) {
        shop.warehouseArray.forEach(warehouse => {
          warehouse.checked = true
          warehouse.goodsArray.forEach(goods => {
            goods.checked = true
          })
        })
      } else {
        shop.warehouseArray.forEach(warehouse => {
          warehouse.checked = false
          warehouse.goodsArray.forEach(goods => {
            goods.checked = false
          })
        })
      }
    },
    // 全选单独变为false
    allCheckedFalse(state, data) {
      let shop = state.cartList.find(item => item.shop.id == data.shopId)
      shop.checked = false
    },
    // 设置仓库备注
    setRemark(state, data) {
      let shopItem = state.cartList.find(shop => shop.shop.id == data.shopId)
      let warehouseItem = shopItem.warehouseArray.find(
        warehouse => warehouse.warehouse.id == data.warehouseId
      )
      warehouseItem.remark = data.value
    },
    // 清空购物车
    clearCartList(state) {
      state.cartList = []
    },
    // 购物车清除已提交货物
    clearSubmitted(state, data) {
      let shopItem = state.cartList.find(shop => shop.shop.id == data.shopId)
      shopItem.warehouseArray.forEach(warehouse => {
        warehouse.goodsArray = warehouse.goodsArray.filter(
          goods => goods.checked == false
        )
      })
      shopItem.warehouseArray = shopItem.warehouseArray.filter(
        warehouse => warehouse.goodsArray.length != 0
      )
    }
  },
  actions: {},
  getters: {
    getLoginUser: state => {
      return state.LoginUser
    }
  },
  plugins: [
    // 保持vuex状态，解决刷新vuex丢失
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})
