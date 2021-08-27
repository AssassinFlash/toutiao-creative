<template>
  <!--1.先准备Echarts展示的dom-->
  <div ref="map" class="map-container"></div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import { useEchartsOptions } from '@/components/Fans/useEcharts'

export default {
  name: 'mapEcharts',
  setup () {
    // 2.在需要的组件内使用inject引入在app组件中provide出来的echarts容器
    const echarts = inject('ec')
    // 获得dom
    const map = ref()
    // 获取echarts配置
    const option = useEchartsOptions()
    // 3.在mounted钩子中进行echarts初始化
    onMounted(() => {
      const myChart = echarts.init(map.value)
      myChart.setOption(option)
    })
    return {
      map
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 600px;
  height: 400px
}
</style>
