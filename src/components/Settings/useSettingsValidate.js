export function useFormRules () {
  return {
    name: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'blur'
      },
      {
        min: 1,
        max: 7,
        message: '用户名长度为1到7个字符',
        trigger: 'change'
      }
    ],
    intro: [
      {
        required: true,
        message: '用户简介不能为空',
        trigger: 'blur'
      },
      {
        min: 3,
        max: 100,
        message: '用户简介不能少于3个字符',
        trigger: 'change'
      }
    ],
    email: [
      {
        required: true,
        message: '用户邮箱不能为空',
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z0-9-_]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9-_]+)+$/,
        message: '请按照正确的格式填写用户邮箱',
        trigger: 'change'
      }
    ]
  }
}
