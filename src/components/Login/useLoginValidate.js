// 把表单验证另外写到一个文件上，减少组件代码量
export default function () {
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
  return {
    // 要验证的数据名(与表单项指定的name属性名一致)：规则列表[]
    mobile: [
      {
        required: true, // 必填，不能为空
        message: '手机号不能为空', // 提示消息
        trigger: 'blur'// 触发条件:当失去焦点时触发
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
}
