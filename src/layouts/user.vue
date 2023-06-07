<template>
    <el-container style="height:100vh;" class="bg-gray-100">
        <el-container class="overflow-hidden">
            <!-- 侧边栏 -->
            <el-aside :width="$store.state.asideWidth">
                <f-menu />
            </el-aside>
            <!-- 主页面 -->
            <el-container>
                <!-- 头部 -->
                <el-header>
                    <f-header />
                </el-header>
                <el-main>
                    <router-view v-slot="{ Component }">
                        <transition name="fade">
                            <keep-alive :max="10">
                                <component :is="Component"></component>
                            </keep-alive>
                        </transition>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
<script setup>
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'

</script>
<style>
.el-aside{
    transition: all 0.2s;
}
</style>