import { createStore } from 'vuex'
import { getinfo } from '~/api/user.js'
import * as auth from '~/composables/auth'
const store = createStore({
    state () {
      return {
        //用户信息
        user: {},
        //menu宽度
        asideWidth:"250px"
      }
    },
    mutations: {
        //记录用户信息
        SET_USERINFO(state, user) {
            state.user = user
    },
    handleAsideWidth(state){
        state.asideWidth = state.asideWidth == "250px" ? "62px" : "250px";
    }
  },
    actions: {
        //获取用户信息
        getinfo({ commit }){
            return new Promise((resolve, reject) => {
                //从服务器获取用户信息存储到vuex
                getinfo().then(res => {
                    commit('SET_USERINFO', res)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //退出登录，清楚cookie以及vuex
        logout({ commit }){
            auth.removeToken()
            commit('SET_USERINFO', {})
        }
    }
})
export default store