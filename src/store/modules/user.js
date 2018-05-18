import { login, logout, getInfo, menuItem } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    userId: '',
    rolesValue: '',
    roles: '',
    editMenu: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_AVATAR: (state, rolesValue) => {
      state.rolesValue = rolesValue
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_EDITMENU: (state, editMenu) => {
      state.editMenu = editMenu
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.displayName)
          commit('SET_USER_ID', data.userId)
          commit('SET_AVATAR', data.rolesValue)
          menuItem().then(res => {
            const datachild = res.list
            commit('SET_EDITMENU', datachild)
            resolve(response)
          }).catch(error => {
            reject(error)
          })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 修改
    editMenu({ commit }) {
      return new Promise((resolve, reject) => {
        menuItem().then(response => {
          const datachild = response.list
          commit('SET_EDITMENU', datachild)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
