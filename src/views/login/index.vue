<template>
  <!--
    a-form表单
    表单项用a-form-item包裹
  -->
  <div class="login-container">
    <a-form :model="user" class="login-form">
      <img src="./logo_index.png" alt="">
      <a-form-item class="login-form-item">
        <a-input
          v-model:value="user.mobile"
          placeholder="请输入手机号"
          class="login-form-input"
        />
      </a-form-item>
      <a-form-item class="login-form-item">
        <a-input
          v-model:value="user.code"
          placeholder="请输入验证码"
          class="login-form-input"
        />
      </a-form-item>
      <a-form-item class="login-form-item">
        <a-checkbox
          v-model:checked="checked"
          class="login-form-checkbox"
        >
          <span>我已阅读并同意用户协议和隐私条款</span>
        </a-checkbox>
      </a-form-item>
      <a-form-item class="login-form-item">
        <a-button
          type="primary"
          @click="onSubmit"
          class="login-btn"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'LoginIndex',
  setup () {
    var user = reactive({
      mobile: '',
      code: ''
    })
    var checked = ref(false) // 是否同意协议的选中
    var onSubmit = function () {
      console.log('submit')
    }
    return {
      user,
      checked,
      onSubmit
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
      margin: 10px 0;
      padding: 0;
      height: 50px;

      .login-form-input {
        flex: 1;
        padding: 10px;
        font-size: 16px;
        line-height: 1.4;
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
</style>
