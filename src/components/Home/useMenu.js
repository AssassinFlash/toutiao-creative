export default function () {
  // 生成侧边栏菜单
  return [
    {
      path: '/',
      title: '首页',
      icon: 'icon-shouye-black'
    },
    {
      path: '/article',
      title: '内容管理',
      icon: 'icon-neirong'
    },
    {
      path: '/image',
      title: '素材管理',
      icon: 'icon-sucai'
    },
    {
      path: '/publish',
      title: '发布文章',
      icon: 'icon-fabu'
    },
    {
      path: '/comment',
      title: '评论管理',
      icon: 'icon-pinglun'
    },
    {
      path: '/fans',
      title: '粉丝管理',
      icon: 'icon-icon-test'
    },
    {
      path: '/settings',
      title: '个人设置',
      icon: 'icon-shezhi'
    }
  ]
}
