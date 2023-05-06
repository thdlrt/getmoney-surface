import{
    createRouter,
    createWebHashHistory
}from 'vue-router'
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue' 
import NotFound from '~/pages/404.vue'
import User from '~/layouts/user.vue'
import Hot from '~/pages/data/hot.vue'
import Main from '~/pages/data/main.vue'
import News from '~/pages/data/news.vue'
import Search from '~/pages/data/search.vue'
import Advise from '~/pages/ai/advise.vue'
import Future from '~/pages/ai/future.vue'
import Try from '~/pages/imitate/try.vue'
import Virtual from '~/pages/imitate/virtual.vue'
import Invest from '~/pages/user/invest.vue'
import Record from '~/pages/user/record.vue'
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
        path:'/data/hot',
        component:Hot,
        meta :{
            title:'热门股票'
        }
    },{
        path:'/data/search',
        component:Search,
        meta :{
            title:'自选搜索'
        }
    },{
        path:'/data/news',
        component:News,
        meta :{
            title:'新闻速递'
        }
    },{
        path:'/imitate/try',
        component:Try,
        meta :{
            title:'策略回测'
        }
    },{
        path:'/imitate/virtual',
        component:Virtual,
        meta :{
            title:'模拟交易'
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
        path:'/user/invest',
        component:Invest,
        meta :{
            title:'我的投资'
        }
    },{
        path:'/user/record',
        component:Record,
        meta :{
            title:'交易记录'
        }
    },]
},{
    path: '/login', 
    component: Login,
    meta :{
        title:'登录'
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