<template>
  <div id="app">
    <keep-alive include="Notice,VisitShop,Order">
      <router-view />
    </keep-alive>
  </div>
</template>

<script></script>

<style lang="scss">
#app {
  background: white;
}

// 修改mintui样式
.mint-spinner-snake {
  width: px2rem(64) !important;
  height: px2rem(64) !important;
}
.mint-indicator-text {
  font-size: px2rem(30) !important;
  line-height: px2rem(30) !important;
}
.mint-toast-text {
  // height: px2rem(80) !important;
  line-height: px2rem(30) !important;
  font-size: px2rem(30) !important;
}
.mint-popup {
  width: px2rem(200) !important;
  // height: px2rem(300) !important;
  padding: px2rem(50);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.mint-checklist {
  .mint-checklist-title {
    font-size: px2rem(40) !important;
    background-image: none;
    background-color: white;
  }
  .mint-cell-wrapper {
    // mintui中是使用线性渐变的方法达成视觉上小于1px的border。线性渐变属于图片数据类型，可以充当背景图，但不可用于background-color，但可以用于background-image来完成渐变。background-image: none;可以去边框
    background-image: none;
    padding: px2rem(25) 0;
  }
  .mint-checkbox-label {
    font-size: px2rem(35) !important;
  }
}

// 修改mescroll样式
.mescroll-totop {
  width: px2rem(80) !important;
  height: px2rem(80) !important;
}
.mescroll .upwarp-tip {
  font-size: px2rem(30) !important;
}
.mescroll .downwarp-tip {
  font-size: px2rem(30) !important;
}
.mescroll .upwarp-nodata {
  font-size: px2rem(30) !important;
}
// 无数据样式
.mescroll-empty {
  background: white;
  .empty-tip {
    font-size: px2rem(30) !important;
  }
}

.mint-cell {
  height: px2rem(100);
  .mint-cell-wrapper {
    font-size: px2rem(30);
  }
}
</style>
