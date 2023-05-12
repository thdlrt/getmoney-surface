<template>
    <!-- 菜单栏自动渲染 -->
    <div class="fmenu">
        <el-menu default-active="2" class="border-0" @select="handleSelect" :collapse="isCollapse" :unique-opened="true">
            <template v-for="(item, index) in menus" :key="index">
                <div class="bg-blue-100  overflow-hidden">
                    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.name">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item v-for="(item2, index2) in item.children" :key="index2" :index="item2.frontpath">
                            <el-icon>
                                <component :is="item2.icon"></component>
                            </el-icon>
                            <span>{{ item2.name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item v-else :index="item.frontpath">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
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
const handleSelect = (path) => {
    router.push(path)
}
//折叠菜单
const isCollapse = computed(() => {
    return !(store.state.asideWidth == '240px')
})
//列表内容
const menus = [{
    "name": "　　　数据监测　　　",
    "icon": "Histogram",
    "frontpath": "/data/main"
}, {
    "name": "　　　AI策略",
    "icon": "Grid",
    "children": [{
        "name": "　　　股票预测",
        "icon": "Aim",
        "frontpath": "/ai/future",
    }, {
        "name": "　　　投资组合",
        "icon": "WalletFilled",
        "frontpath": "/ai/advise",
    }, {
        "name": "　　　策略回测",
        "icon": "Switch",
        "frontpath": "/ai/test",
    }]
}, {
    "name": "　　　新闻速递",
    "icon": "Share",
    "frontpath": "/data/news",
}, {
    "name": "　　　个人中心",
    "icon": "User",
    "frontpath": "/user",
}]
</script>
<style>
.fmenu {
    top: 60px;
    bottom: 0;
    left: 0;
    overflow: auto;
    @apply shadow-md fixed bg-blue-100;
}
</style>