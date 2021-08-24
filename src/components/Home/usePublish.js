export function useFormRules () {
  // 表单验证规则
  return {
    title: [
      {
        required: true,
        message: '请输入文章标题',
        trigger: 'blur'
      },
      {
        min: 3,
        max: 30,
        message: '文章标题字数至少为3',
        trigger: 'change'
      }
    ],
    content: [
      {
        required: true,
        message: '请输入文章内容',
        trigger: 'blur'
      }
    ],
    channel_id: [
      {
        required: true,
        message: '请选择文章频道'
      }
    ]
  }
}
