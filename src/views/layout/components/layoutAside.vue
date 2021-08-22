<template>
  <a-menu
    id="dddddd"
    mode="inline"
    v-model:selectedKeys="selectedKeys"
  >
    <div class="title-image">
      <img src="../../../assets/superman.svg" alt="">
      <!--      <span>{{ istitleShow }}</span>-->
    </div>
    <!--
        a-menu-item的key不能重复-->
    <a-menu-item
      v-for="item in menu"
      :key="item.path"
      @click="toWebSite(item.path)"
    >
      <icon-font :type="item.icon"></icon-font>
      <span>{{ item.title }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useMenu from '@/components/Home/useMenu'
import { createFromIconfontCN } from '@ant-design/icons-vue'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2758474_a0gbql4hd8u.js'
})
export default {
  name: 'LayoutAside',
  components: {
    IconFont
  },
  setup () {
    // 生成菜单项
    const menu = useMenu()
    // 选择的菜单项
    const selectedKeys = ref(['/'])
    // 获得路由对象
    const $router = useRouter()

    // 跳转方法
    const toWebSite = function (path) {
      $router.push(path)
    }
    return {
      selectedKeys,
      toWebSite,
      menu
    }
  }
}
</script>

<style lang="less" scoped>
.title-image {
  padding: 10px 0;
  text-align: center;

  img {
    width: 60px;
  }

  span {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
