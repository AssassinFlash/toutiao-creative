export function useTableColumns () {
  return [
    {
      dataIndex: 'title',
      title: '标题',
      width: '30%'
    },
    {
      dataIndex: 'total_comment_count',
      title: '总评论数',
      width: '15%',
      align: 'center'
    },
    {
      dataIndex: 'fans_comment_count',
      title: '粉丝评论数',
      width: '15%',
      align: 'center'
    },
    {
      dataIndex: 'comment_status',
      title: '状态',
      align: 'center',
      slots: {
        customRender: 'status'
      }
    },
    {
      dataIndex: 'methods',
      title: '操作',
      align: 'center',
      slots: {
        customRender: 'action'
      }
    }
  ]
}
