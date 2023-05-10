import{
    createRouter,
    createWebHashHistory
}from 'vue-router'
import Login from '~/pages/login.vue' 
import NotFound from '~/pages/404.vue'
import User from '~/layouts/user.vue'
import Hot from '~/pages/data/hot.vue'
import Main from '~/pages/data/main.vue'
import News from '~/pages/data/news.vue'
import Search from '~/pages/data/search.vue'
import Advise from '~/pages/ai/advise.vue'
import Future from '~/pages/ai/future.vue'
import UserCenter from '~/pages/user/user.vue'
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
        path:'/user',
        component:UserCenter,
        meta :{
            title:'个人中心'
        }
    }]
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