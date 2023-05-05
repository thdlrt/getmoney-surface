<template>
    <div>
        主页
        {{$store.state.user.username}}
        <el-button @click="userlogout">退出登录</el-button>
    </div>
</template>
<script setup>
    import * as util from '~/composables/util'
    import { logout } from '~/api/user'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    const store = useStore()
    const router = useRouter()
    //退出登录
    function userlogout(){
        util.showModal("确定退出登录？").then(res=>{
            logout().finally(res=>{
                //清除cookie\vuex
                store.dispatch("logout")
                //跳转
                router.push("/login")
                util.toast("退出成功")
            })
        })
    }
 
</script>