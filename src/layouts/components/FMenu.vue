<template>
    <!-- 菜单栏自动渲染 -->
    <div class="fmenu" :style="{ width: $store.state.asideWidth }">
        <!-- logo -->
        <el-card v-if="$store.state.asideWidth == '250px'" class="box-card m-4 rounded-md"
            style="background: radial-gradient(circle, #E1F5FE, #52a8ee);">
            <div style="display: flex;" class="w-[180px] mx-1">
                <img src="../../assets/logo.png" alt="Logo" class="h-12 w-39 cursor-pointer" @click="onback">
            </div>
        </el-card>
        <el-menu default-active="2" class="border-0 el-menu-vertical-demo bg-blue-200" @select="handleSelect"
            :collapse="isCollapse" :unique-opened="true" active-text-color="#ffd04b" text-color="black"
            :collapse-transition="false">
            <template v-for="(item, index) in menus" :key="index">
                <div class=" overflow-hidden">
                    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.name">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span class="m-5">{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="(item2, index2) in item.children" :key="index2" :index="item2.frontpath"
                            class="bg-blue-100">
                            <el-icon>
                                <component :is="item2.icon"></component>
                            </el-icon>
                            <span class="m-5">{{ item2.name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item v-else :index="item.frontpath">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span class="m-5">{{ item.name }}</span>
                    </el-menu-item>
                </div>
            </template>
        </el-menu>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
//返回
const onback = () => {
    router.push('/login')
}
const handleSelect = (path) => {
    router.push(path)
}
//折叠菜单
const isCollapse = computed(() => {
    return !(store.state.asideWidth == '250px')
})
//列表内容
const menus = [{
    "name": "数据监测",
    "icon": "Histogram",
    "frontpath": "/data/main"
}, {
    "name": "AI策略",
    "icon": "Grid",
    "children": [{
        "name": "股票预测",
        "icon": "Aim",
        "frontpath": "/ai/future",
    }, {
        "name": "投资组合",
        "icon": "WalletFilled",
        "frontpath": "/ai/advise",
    }, {
        "name": "策略回测",
        "icon": "Switch",
        "frontpath": "/ai/test",
    }]
}, {
    "name": "新闻速递",
    "icon": "Share",
    "frontpath": "/data/news",
}, {
    "name": "用户相关",
    "icon": "User",
    "children": [{
        "name": "个人中心",
        "icon": "Files",
        "frontpath": "/user/center",
    }, {
        "name": "钱包管理",
        "icon": "CreditCard",
        "frontpath": "/user/wallet",
    }]
}]
</script>
<style>
.fmenu {
    top: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    @apply shadow-md fixed bg-blue-200;
}
</style>