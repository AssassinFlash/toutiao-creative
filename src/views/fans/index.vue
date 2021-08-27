<template>
  <div class="fans-container">
    <mapEcharts></mapEcharts>
  </div>
</template>

<script>
import mapEcharts from '@/views/fans/components/mapEcharts'

export default {
  name: 'FansIndex',
  components: {
    mapEcharts
  },
  setup () {
    return {}
  }
}
</script>

<style lang="less" scoped>

</style>
