import{
    createRouter,
    createWebHashHistory
}from 'vue-router'
import Login from '~/pages/login.vue' 
import NotFound from '~/pages/404.vue'
import User from '~/layouts/user.vue'
import Main from '~/pages/data/main.vue'
import News from '~/pages/data/news.vue'
import Advise from '~/pages/ai/advise.vue'
import Future from '~/pages/ai/future.vue'
import Test from '~/pages/ai/test.vue'
import UserCenter from '~/pages/user/center.vue'
import Wallet from '~/pages/user/wallet.vue'
import Forget from '~/pages/forget.vue'
const routes = [{
    path:'/',
    component:User,
    children:[{
        path:'/data/main',
        component:Main,
        meta :{
            title:'大盘数据'
        }
    },{
        path:'/data/news',
        component:News,
        meta :{
            title:'新闻速递'
        }
    },{
        path:'/ai/future',
        component:Future,
        meta :{
            title:'股票预测'
        }
    },{
        path:'/ai/advise',
        component:Advise,
        meta :{
            title:'投资组合'
        }
    },{
        path:'/ai/test',
        component:Test,
        meta :{
            title:'策略回测'
        }
    },{
        path:'/user/center',
        component:UserCenter,
        meta :{
            title:'个人中心'
        }
    },{
        path:'/user/wallet',
        component:Wallet,
        meta :{
            title:'钱包管理'
        }
    }]
},{
    path: '/login', 
    component: Login,
    meta :{
        title:'登录'
    }
},{
    path: '/forget', 
    component: Forget,
    meta :{
        title:'找回密码'
    }
},{ 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound ,
    meta :{
        title:'404'
    }
},]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router