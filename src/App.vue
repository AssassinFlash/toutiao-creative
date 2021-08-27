<template>
  <!-- 路由出口，匹配的路由页面就会显示到router-view里 -->
  <router-view/>
</template>
<script>
// 加载echarts组件
import * as echarts from 'echarts'
import { provide } from 'vue'

export default {
  name: 'App',
  setup () {
    // setup中没有this,而且这时候还没有渲染,
    // 所以在setup中 ,可以使用provide/inject来把echart引入进来
    provide('ec', echarts)
    return {}
  }
}
</script>
<style lang="less"></style>
