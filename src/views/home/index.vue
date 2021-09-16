<template>
  <div class="home">
    <a-row>
<!--      <a-col :span="12"><echartsDemo></echartsDemo></a-col>-->
      <a-col :span="24"><echarsDemo1></echarsDemo1></a-col>
    </a-row>
  </div>
</template>

<script>
// import echartsDemo from '@/views/home/components/echartsDemo'
import echarsDemo1 from '@/views/home/components/echarsDemo1'
export default {
  name: 'HomeIndex',
  components: {
    // echartsDemo,
    echarsDemo1
  }
}
</script>

<style lang="less" scoped>

</style>
