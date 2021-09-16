<template>
  <!--  1.为echars准备一个具备大小的画布容器-->
  <div ref="main" style="height: 400px"></div>
</template>

<script>
// 2.加载echarts
import { ref, inject, onMounted } from 'vue'
import useEchartCalendar from '@/components/Home/useEchartCalendar'

export default {
  name: 'echartsDemo',
  setup () {
    const main = ref()
    const echarts = inject('ec')
    onMounted(() => {
      // 3.初始化图表
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表
      const myChart = echarts.init(main.value)
      const option = useEchartCalendar()
      myChart.setOption(option)
    })
    return {
      main
    }
  }
}
</script>

<style lang="less" scoped>

</style>
