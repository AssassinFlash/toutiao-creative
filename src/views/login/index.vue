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
import { requestNet } from '@/utils/request'
import Loading from '@/components/LoginLoading/Loading'
export default {
  name: 'LoginIndex',
  components: {
    Loading
  },
  setup: function (props, context) {
    // 防止网络请求慢出现用户多次点击触发登录请，交互反馈更好
    const isLoadingShow = ref(false) // 登录的loading状态
    // 获取表单数据
    const user = reactive({
      mobile: '', // 手机号
      code: '', // 验证码
      isAgree: false // 是否同意协议
    })
    // 获取form表单元素(变量与ref名字同名即可)
    const loginForm = ref()

    // 自定义校验规则，返回promise对象，这是因为触发校验方法使用的是promise
    const validateCheck = async function (rule, value) {
      // rule默认传，value就是表单元素的value，对于checkbox，选中了value就为true
      if (!value) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('未勾选协议')// 内容就是规则的message
      } else {
        return Promise.resolve()
      }
    }

    // 表单验证规则配置
    const formRules = {
      // 要验证的数据名(与表单项指定的name属性名一致)：规则列表[]
      mobile: [
        {
          required: true, // 必填，不能为空
          message: '手机号不能为空', // 提示消息
          trigger: 'blur'// 触发条件:当内容修改时触发
        },
        {
          pattern: /^1\d{10}$/, // 正则表达式
          message: '请输入正确的号码格式',
          trigger: 'change'// 当内容修改时触发
        }
      ],
      code: [
        {
          required: true,
          message: '验证码不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^\d{6}$/,
          message: '长度为6个数字',
          trigger: 'change'
        }
      ],
      isAgree: [
        // 对于checkbox，一般要自定义验证规则，使用自定义验证规则要在对象内配置validator属性
        // 不需要写message，因为自定义校验函数里配置了message
        {
          // 校验器使用前面定义的校验函数
          validator: validateCheck,
          trigger: 'change'
        }
      ]
    }

    // 方法
    const loginMethod = function () {
      // loading组件显示
      isLoadingShow.value = true
      requestNet({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        // data用来设置post请求体
        data: user
      }).then(value => {
        // 验证通过，提交登录
        console.log(value.data)
        isLoadingShow.value = false
        message.success('登录成功')
      }).catch(() => {
        message.error('登录失败，手机或验证码错误')
        isLoadingShow.value = false
      })
    }

    const onLogin = function () {
      // 通过ref属性获得指定的表单组件，手动触发表单验证，validate返回promise对象
      loginForm.value.validate().then(() => {
        // 表单验证通过了则请求接口
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
.loading{
  position:fixed;
  left:0;
  top: 0;
  bottom:0;
  right:0;
  z-index: 3;
  background: rgba(0,0,0,0.5);
}
</style>
