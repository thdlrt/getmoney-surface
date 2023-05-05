import router from "~/router"
import * as auth from "~/composables/auth"
import * as util from "~/composables/util"
import store from "./store"
//全局前置守卫
router.beforeEach(async(to, from, next) => {
    //开始加载进度条
    util.startLoading()
    //标题设置
    let title = to.meta.title + ' - ' + "FunGenius"
    document.title = title
    //未登录则返回登录
    const token = auth.getToken()
    if(!token && to.path !== '/login' && to.path !== '/signup'){
        util.toast('请先登录', 'error')
        return next('/login')
    }
    //如果刚刚登陆则自动存储信息
    if(token){
        await store.dispatch('getinfo').catch((err) => {
            auth.removeToken()
            return next('/login')
        })
    }
    next()
})
//后置守卫
router.afterEach((to, from) => {
    //结束加载进度条
    util.endLoading()
  })
