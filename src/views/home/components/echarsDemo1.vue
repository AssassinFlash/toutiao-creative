<template>
  <div ref="second" style="height: 600px"></div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import useEchartMap from '@/components/Home/useEchartMap'

export default {
  name: 'echarsDemo1',
  setup () {
    const second = ref()
    const echarts = inject('ec')
    onMounted(() => {
      const myEcharts = echarts.init(second.value)
      const option = useEchartMap()
      myEcharts.setOption(option)
    })
    return {
      second
    }
  }
}
</script>

<style lang="less" scoped>

</style>
