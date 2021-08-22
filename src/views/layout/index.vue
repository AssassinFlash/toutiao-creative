<template>
  <a-layout class="layout-container">
    <!--侧边栏-->
    <a-layout-sider class="layout-aside" collapsible v-model:collapsed="collapse">
      <app-aside class="aside-menu"></app-aside>
    </a-layout-sider>
    <a-layout>
      <!--顶部-->
      <Suspense>
        <a-layout-header class="layout-header">
          <span class="title">志豪今日头条管理后台</span>
          <a-dropdown>
            <div class="avatar-wrap">
              <a-spin :spinning="spin">
                <img :src="userProfile.photo" alt="" v-if="userProfile.photo">
              </a-spin>
              <span>{{ userProfile.name }}</span>
              <icon-font type="icon-xiala" class="avatar-down"/>
            </div>
            <template #overlay>
              <a-menu style="width: 150px;right: -40px">
                <a-menu-item>
                  <icon-font type="icon-shezhi" class="menu-item-icon"></icon-font>
                  <span class="menu-item-title">个人设置</span>
                </a-menu-item>
                <a-menu-item @click="onLogout">
                  <icon-font type="icon-tuichu"></icon-font>
                  <span>用户退出</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-layout-header>
      </Suspense>
      <!--内容-->
      <a-layout-content class="layout-main" style="overflow: auto">
        <!--子路由出口-->
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import AppAside from './components/layoutAside'
import { createFromIconfontCN, BellOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { getUserProfile } from '@/api/user'
import { ref, onBeforeMount, createVNode } from 'vue'
import { useRouter } from 'vue-router'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2758474_a0gbql4hd8u.js'
})
export default {
  name: 'index',
  components: {
    AppAside,
    IconFont
  },
  setup () {
    // 获得路由对象
    const $router = useRouter()
    // 菜单的收缩与展开
    const collapse = ref(false)
    // 顶部用户头像显示延迟
    const spin = ref(true)

    const userProfile = ref({})
    // 利用onBeforeMount钩子函数的特性，在挂载之前获取到用户信息
    // 但是布局要配合Suspense标签使用，不然由于setup函数处于created钩子之间的生命周期
    // 比beforeMount要早，导致异步函数还没开始处理，userProfile就return出去了，这时候userProfile是空的
    // 如果不加Suspense标签，那么使用userProfile的地方就会因为userProfile为空而报错
    onBeforeMount(async () => {
      const res = await getUserProfile(window.localStorage.getItem('user'))
      userProfile.value = res.data.data
      spin.value = false
    })

    // 方法
    const onLogout = () => {
      // 弹出对话框确认是否退出
      // 把用户的登录状态清除
      // 跳转到登录页

      // 使用Modal.confirm弹出对话框
      Modal.confirm({
        title: '确认退出登录状态吗？',
        // 创建字体图标
        icon: createVNode(BellOutlined),
        okText: '确认退出',
        cancelText: '返回',
        // 右上角显示退出按钮
        closable: true,
        content: '点击确认键，1秒后退出到登录页面；点击返回键可撤销',
        // 点击确认
        onOk () {
          // 使用promise实现延迟关闭
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              window.localStorage.removeItem('user')
              $router.push({ name: 'Login' })
              message.success(`用户：${userProfile.value.name} 已退出`, 3)
              resolve()
            }, 1000)
          })
        },
        // 点击返回
        onCancel () {
          message.info('取消退出', 3)
        }
      })
    }
    return {
      userProfile,
      collapse,
      spin,
      onLogout
    }
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  // 大小撑满整个屏幕
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  .layout-aside {
    width: 200px;

    .aside-menu {
      height: 100%;
    }
  }

  .layout-header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #ccc;

    .title {
      margin-left: -20px;
      font-size: 20px;
      font-weight: bold;
    }

    .avatar-wrap {
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border-radius: 50%;
      }

      .avatar-down {
        font-size: 10px;
        width: 20px;
        vertical-align: center;
      }
    }

  }

  .layout-main {
    background: #e9eef3;
  }
}
</style>
