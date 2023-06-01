<template>
    <el-card class="box-card rounded-2xl" shadow="always" style="height:100%;position: relative;">
        <el-row :gutter="0" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;" class="overflow-hidden">
            <!-- 内容 -->
            <!-- 概览 -->
            <el-col :span="10" :offset="0" class="overflow-y-auto overflow-x-hidden" style="height:100%;">
                <ul v-infinite-scroll="load" infinite-scroll-distance="50" :infinite-scroll-disabled="stop" style="height:100%" class="cursor-pointer">
                    <li v-for="(item, index) in news" :key="index" @click="showcontent(item)">
                        <el-row :gutter="4">
                            <!-- 图片 -->
                            <el-col :lg="8" :offset="0">
                                <el-image style="width: 100%; height: 100%" :src="item.thumbnail_pic_s" fit="contain"/>
                            </el-col>
                            <!-- 新闻概述 -->
                            <el-col :lg="16" :offset="0">
                                <div class="text-xl">{{ item.title }}</div>
                                <div class="text-gray-500 flex justify-between pl-2 pr-5 mt-8">
                                    <span>{{ item.author_name }}</span>
                                    <span>{{ item.date }}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-divider />
                    </li>
                    <li v-if="stop">
                        <el-divider><span  class="font-bold text-gray-500">已经到底了</span></el-divider>
                    </li>
                </ul>
            </el-col>
            <el-col :span="1" :offset="0"  style="height:100%">
                <div  class="bg-blue-300 w-[3px] rounded-1" style="height:100%" />
            </el-col>
            <!-- 详细内容 -->
            <el-col :span="13" :offset="0" class="overflow-y-auto" v-if="content!=null">
                <div class="text-3xl font-bold">{{ content.detail.title }}</div>
                <div class="flex justify-center text-gray-500 mt-3">
                    <div>{{ content.detail.author_name }}</div>
                </div>
                <div class="flex justify-center text-gray-500">
                    <div>{{ content.detail.date }}</div>
                </div>
                <div class="flex justify-center mt-3" style="width:100%">
                    <el-image  :src="content.detail.thumbnail_pic_s" fit="contain" style="width:70%"/>
                </div> 
                <div v-html="content.content" class="h-10 mt-5"/>
            </el-col>
        </el-row>
    </el-card>
</template>
<script setup>
import { ref } from 'vue'
import { getnews, getcontent } from '~/api/data.js'
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
            showcontent(news.value[0])
    }).catch(err => {
        util.toast("获取新闻失败","error")
        stop.value = true
    })
}
//获取详细信息
const showcontent = (item) => {
    getcontent(item.uniquekey).then(res => {
        content.value = res
    }).catch(err => {
        util.toast("获取新闻失败","error")
        stop.value = true
    })
}
</script>