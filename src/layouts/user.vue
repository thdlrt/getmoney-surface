<template>
    <el-container>
        <!-- 头部 -->
        <el-header>
            <f-header />
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside>
                <f-menu />
            </el-aside>
            <!-- 主页面 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script setup>
    import FHeader from '~/components/FHeader.vue'
    import FMenu from '~/components/FMenu.vue'
</script>
