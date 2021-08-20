<template>
  <!--
    a-form表单
    表单项用a-form-item包裹
  -->
  <Loading class="loading" v-if="isLoadingShow"></Loading>
  <div class="login-container">
    <!--
      配置Form表单验证使其自动验证：
      1.给a-form组件绑定model属性，为表单数据对象(这里为user)
      2.给需要验证的表单项a-form-item指定name属性，为表单数据对象的属性名(字符串)
      3.给a-form组件绑定rules属性，为验证规则

      手动触发表单验证：
      1.给a-form指定ref属性，取名要与变量名一致
      2.通过ref获取a-form组件，调用组价的validate方法
    -->
    <a-form :model="user" class="login-form" :rules="formRules" ref="loginForm">
      <img src="./logo_index.png" alt="">
      <a-form-item class="login-form-item" name="mobile">
        <a-input
          v-model:value="user.mobile"
          placeholder="请输入手机号"
          class="login-form-input"
        />
      </a-form-item>
      <a-form-item class="login-form-item" name="code">
        <a-input
          v-model:value="user.code"
          placeholder="请输入验证码"
          class="login-form-input"
        />
      </a-form-item>
      <a-form-item name="isAgree">
        <a-checkbox
          v-model:checked="user.isAgree"
          class="login-form-checkbox"
        >
          <span>我已阅读并同意用户协议和隐私条款</span>
        </a-checkbox>
      </a-form-item>
      <a-form-item class="login-form-item">
        <a-button
          type="primary"
          @click="onLogin"
          class="login-btn"
          :loading="isLoadingShow"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'
import useLoginValidate from '@/components/Login/useLoginValidate'
import Loading from '@/components/Login/Loading'

export default {
  name: 'LoginIndex',
  components: {
    Loading
  },
  setup: function (props, context) {
    // 获取路由对象
    const $router = useRouter()
    // 防止网络请求慢出现用户多次点击触发登录请，交互反馈更好
    const isLoadingShow = ref(false) // 登录的loading状态
    // 获取表单数据
    const user = reactive({
      mobile: '13911111111', // 手机号
      code: '246810', // 验证码
      isAgree: true // 是否同意协议
    })
    // 获取form表单元素(变量与ref名字同名即可)
    const loginForm = ref()

    // 从表单验证生成函数中获取表单验证规则
    const formRules = useLoginValidate()

    // 方法
    const loginMethod = function () {
      // loading组件显示
      isLoadingShow.value = true
      // 使用api接口的登录方法
      login(user).then(value => {
        // 验证通过，提交登录
        isLoadingShow.value = false
        // 拿到接口返回的用户令牌token并将token存储到localStorage，方便数据共享
        window.localStorage.setItem('user', value.data.data.token)
        // 进入首页
        $router.push({ name: 'Home' })
        message.success(`用户：${value.data.data.name} 登入后台`)
      }).catch(() => {
        isLoadingShow.value = false
        message.error('登录失败，手机号或验证码错误')
      })
    }

    const onLogin = function () {
      // 通过ref属性获得指定的表单组件，手动触发表单验证，validate返回promise对象
      loginForm.value.validate().then(() => {
        // 表单验证通过了则调用loginMethod方法
        loginMethod()
      }).catch(() => {
        console.log('表单验证失败')
      })
    }

    return {
      isLoadingShow,
      user,
      formRules,
      loginForm,
      onLogin
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  //定位到全部大小
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url("../login/login_bg.jpg") no-repeat;
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 400px;
    background: rgba(255, 255, 255, .4);
    padding: 30px 50px 50px;

    .login-form-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 10px 0 5px;
      padding: 0;
      height: 65px;

      .login-form-input {
        flex: 1;
        padding: 10px;
        font-size: 15px;
        line-height: 1.5;
      }

      .ant-checkbox-wrapper {
        font-size: 16px;
      }

      .ant-form-item-control {
        justify-content: center;
      }

      .login-btn {
        width: 100%;
        height: 50px;
        padding: 10px 0;
        font-size: 20px;
      }

    }

    img {
      width: 200px;
      margin: 0 auto 20px;
    }
  }
}

.loading {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
  background: rgba(0, 0, 0, 0.5);
}
</style>
