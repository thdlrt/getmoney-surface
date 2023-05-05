import{
    createRouter,
    createWebHashHistory
}from 'vue-router'
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue' 
import NotFound from '~/pages/404.vue'
import Signup from '~/pages/signup.vue'
import User from '~/layouts/user.vue'
const routes = [{
    path:'/',
    component:User,
    children:[{
        path:'/',
        component:Index,
        meta :{
            title:'首页'
        }
    },]
},{
    path: '/login', 
    component: Login,
    meta :{
        title:'登录'
    }
},{ 
    path: '/signup', 
    component: Signup,
    meta :{
        title:'注册'
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