import { createStore } from 'vuex'

export default createStore({
  state: {
    selectedKeys: [], // 生成的菜单项
    coverIndex: 0 // 单图还是三图还是无图
  },
  mutations: {
    popSelectedKeys: function (state) {
      if (state.selectedKeys.length !== 0) {
        state.selectedKeys.shift()
      }
    },
    setSelectedKeys: function (state, path) {
      state.selectedKeys.push(path)
    },
    setCoverIndex: function (state, value) {
      state.coverIndex = value
    }
  },
  actions: {},
  modules: {}
})
