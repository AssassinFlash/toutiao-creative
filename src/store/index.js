import { createStore } from 'vuex'

export default createStore({
  state: {
    selectedKeys: [] // 生成的菜单项
  },
  mutations: {
    popSelectedKeys: function (state) {
      if (state.selectedKeys.length !== 0) {
        state.selectedKeys.shift()
      }
    },
    setSelectedKeys: function (state, path) {
      state.selectedKeys.push(path)
      // console.log(state.selectedKeys)
    }
  },
  actions: {
  },
  modules: {
  }
})
