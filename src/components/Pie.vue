<template>
  <div class="wrapper">
    <div class="pieWrapper">
      <div ref="pie" class="pie"></div>
      <div class="val">{{ val }}<span v-if="isPercentShow">%</span></div>
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入饼状图
import 'echarts/lib/chart/pie'
// 引入提示框和标题组件
import('echarts/lib/component/tooltip')
import('echarts/lib/component/title')
export default {
  name: 'Pie',
  props: {
    title: { type: String, default: '无' },
    val: { type: Number, default: 0 },
    isPercentShow: { type: Boolean, default: true }
  },
  mounted() {
    this.setEchart()
  },
  updated() {
    this.setEchart()
  },
  methods: {
    setEchart() {
      let myChart = echarts.init(this.$refs.pie)
      myChart.setOption({
        color: ['#2ade69', 'rgb(223,223,223)'],
        series: [
          {
            type: 'pie',
            // 取消划过/点击的放大事件
            silent: true,
            // 设置饼图边框大小
            radius: ['95%', '100%'],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.val, name: '' },
              { value: this.isPercentShow ? 100 - this.val : 0, name: '' }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  .pieWrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .pie {
      width: px2rem(200);
      height: px2rem(200);
    }
    .val {
      position: absolute;
      font-size: px2rem(50);
      span {
        position: absolute;
        font-size: px2rem(30);
      }
    }
  }
  .title {
    text-align: center;
    font-size: $text-size-mid;
    margin-top: px2rem(20);
  }
}
</style>
