<template>
    <el-card class="box-card rounded-2xl" shadow="always" style="height:100%;position: relative;">
        <el-row :gutter="0" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;" class="overflow-hidden">
            <!-- 内容 -->
            <!-- 概览 -->
            <el-col :span="10" :offset="0" class="overflow-y-auto overflow-x-hidden" style="height:100%;">
                <ul v-infinite-scroll="load" infinite-scroll-distance="50" :infinite-scroll-disabled="stop"
                    style="height:100%" class="cursor-pointer">
                    <li v-for="(item, index) in news" :key="index" @click="showcontent(index)">
                        <el-row :gutter="4">
                            <!-- 图片 -->
                            <el-col :lg="8" :offset="0">
                                <el-image v-if="item.detail.thumbnail_pic_s" style="width: 100%; height: 100%"
                                    :src="item.detail.thumbnail_pic_s" fit="contain" />
                                <img v-else src="../../assets/chat.jpg" />
                            </el-col>
                            <!-- 新闻概述 -->
                            <el-col :lg="16" :offset="0">
                                <div class="text-xl">{{ item.detail.title }}</div>
                                <div class="text-gray-500 flex justify-between pl-2 pr-5 mt-8">
                                    <span>{{ item.detail.author_name }}</span>
                                    <span>{{ item.detail.date }}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-divider />
                    </li>
                    <li v-if="stop">
                        <el-divider><span class="font-bold text-xl text-gray-500">已经到底了</span></el-divider>
                    </li>
                </ul>
            </el-col>
            <el-col :span="1" :offset="0" style="height:100%">
                <div class="bg-blue-300 w-[3px] rounded-1" style="height:100%" />
            </el-col>
            <!-- 详细内容 -->
            <el-col :span="13" :offset="0" class="overflow-y-auto py-8 px-3" v-if="content != null">
                <div class="flex justify-center items-center">
                    <div class="text-3xl font-bold">{{ content.detail.title }}</div>
                </div>
                <div class="flex justify-center text-gray-500 mt-3">
                    <div>{{ content.detail.author_name }}</div>
                </div>
                <div class="flex justify-center text-gray-500">
                    <div>{{ content.detail.date }}</div>
                </div>
                <div class="flex justify-center mt-3" style="width:100%">
                    <el-image v-if="content.detail.thumbnail_pic_s" :src="content.detail.thumbnail_pic_s" fit="contain"
                        style="width:70%" />
                </div>
                <div v-html="content.content" class="h-10 mt-5 text-xl" />
            </el-col>
        </el-row>
    </el-card>
</template>
<script setup>
import { ref } from 'vue'
import { getnews } from '~/api/data.js'
import * as util from '~/composables/util'
const page = ref(1)
const stop = ref(false)
//无缝滚动
const news = ref([])
const content = ref(null)
//TODO新的获取方式
const load = () => {
    getnews(page.value).then(res => {
        news.value = news.value.concat(res.data)
        page.value++
        //初始化详细信息
        if (content.value == null)
            showcontent(0)
        if (res.data.length == 0)
            stop.value = true
        else
            stop.value = false
    })
}
//获取详细信息
const showcontent = (index) => {
    content.value = news.value[index]
}
</script>