<template>
    <el-card class="box-card rounded-2xl" shadow="always" style="height:100%;position: relative;">
        <el-row :gutter="10" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;" class="overflow-hidden">
            <!-- 侧栏 -->
            <el-col :md="8" :sm="8" :xs="10" :offset="0" style="border-right: 2px solid #838383;height:100%;"
                class="overflow-hidden">
                <!-- 选择栏 -->
                <el-tabs v-model="activeName" class="demo-tabs ml-5">
                    <el-tab-pane label="热门"></el-tab-pane>
                    <el-tab-pane label="自选"></el-tab-pane>
                    <el-tab-pane label="搜索">
                        <el-row :gutter="0" class="justify-center items-center">
                            <el-col :span="18" :offset="0">
                                <el-input v-model="input" class="m-2" placeholder="代码/名称" style="width:90%;">
                                    <template #prefix>
                                        <el-icon class="el-input__icon">
                                            <Search />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span="6" :offset="0">
                                <el-button type="primary" @click="onsearch">搜索</el-button>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
                <!-- 表格 -->
                <el-table :data="tableData" stripe style="width: 100%;height:100%">
                    <el-table-column fixed prop="name" label="名称" sortable />
                    <el-table-column prop="price" label="价格" sortable />
                    <el-table-column prop="rate" label="涨跌" sortable>
                        <template #default="{ row }">
                            <span :style="{ color: row.rate > 0 ? 'red' : 'green' }">{{ row.rate }}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template #default="{ row }">
                            <div class="flex justify-center items-center">
                                <el-button link v-if="choiceName.indexOf(row.name) == -1" type="primary" size="small"
                                    @click="onadd(row)">选择</el-button>
                                <el-popconfirm v-else title="确认删除?" confirm-button-text="确认" cancel-button-text="取消"
                                    @confirm="ondel(row)">
                                    <template #reference>
                                        <el-button link type="danger" size="small">删除</el-button>
                                    </template>
                                </el-popconfirm>
                                <el-button link type="primary" size="small" @click="ondetail(row)">查看</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <!-- 主体 -->
            <el-col :md="16" :sm="16" :xs="14" :offset="0" class="overflow-x-hidden overflow-y-auto" style="height:100%;">
                <!-- 概述 -->
                <div>
                    <div style="border-bottom: 2px solid #87afff;height:100%;" class="pb-2">
                        <span class="text-xl ml-5">{{ stockData.name }}</span>
                        <span class="text-sm text-gray-500 ml-4">({{ stockData.id }})</span>
                    </div>
                    <el-row :gutter="4">
                        <el-col :lg="6" :md="10" :offset="0" style="height:100%;">
                            <div class="flex justify-center items-center mt-3"
                                :style="{ color: stockData.changeprice > 0 ? 'red' : 'green' }">
                                <span class="text-2xl">{{ stockData.price }}</span>
                                <up-two v-if="stockData.changeprice > 0" theme="filled" size="28" fill="#ff0020" />
                                <down-two v-else theme="filled" size="28" fill="#447a04" />
                                <div style="display: inline-block;" class="ml-1">
                                    <div class="text-xs">{{ stockData.changeprice }}</div>
                                    <div class="text-xs">{{ stockData.changerate }}%</div>
                                </div>
                            </div>
                            <div class="h-[2px] bg-gray-200" style="width:80%;margin: 0 auto;" />
                            <div class="flex items-center justify-center text-xs text-gray-500 mt-1">
                                <span>{{ stockData.date }}</span>
                                <span class="ml-3">{{ stockData.time }}</span>
                            </div>
                        </el-col>
                        <el-col :ld="18" :md="14" :offset="0" class="overflow-hidden pb-3"
                            style="border-left: 2px solid #e4e7ed;">
                            <div class="flex flex-wrap items-center ml-5 mt-2" style="width:100%;">
                                <div v-for="(item, index) in stockData.info" :key="index" class="w-[150px] m-[1px]">
                                    <span class="text-sm">{{ item.name }}：</span>
                                    <span class="text-sm">{{ item.value }}</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!-- 选择图表 -->
                <el-tabs type="border-card" v-model="activeChart" class="mt-3">
                    <el-tab-pane label="分时" name="0" class="chartbox">
                        <stock-chart :data="stockDatah" :type="0" :id="'chart1'" />
                    </el-tab-pane>
                    <el-tab-pane name="1" label="日k" class="chartbox">
                        <stock-chart :data="stockDatak[0]" :type="1" :id="'chart2'" />
                    </el-tab-pane>
                    <el-tab-pane name=2 label="周k" class="chartbox">
                        <stock-chart :data="stockDatak[1]" :type="1" :id="'chart3'" />
                    </el-tab-pane>
                    <el-tab-pane name="3" label="月k" class="chartbox">
                        <stock-chart :data="stockDatak[2]" :type="1" :id="'chart4'" />
                    </el-tab-pane>
                    <el-tab-pane name="4" label="年k" class="chartbox">
                        <stock-chart :data="stockDatak[3]" :type="1" :id="'chart5'" />
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>

    </el-card>
</template>
<script setup>
import { ref, watch } from 'vue'
import { gethot, search, getchoice, addchoice, delchoice, getstock, getstockh, getstockk } from '~/api/data.js'
import { UpTwo, DownTwo } from '@icon-park/vue-next';
import StockChart from '~/components/StockChart.vue'
const activeName = ref(0)
const activeChart = ref("0")
const input = ref('')
const tableData = ref([])
const choiceData = ref([])
const stockData = ref(null)
const stockDatak = ref([])
const stockDatah = ref(null)
const choiceName = ref([])
var timerId

//更新表格（选择发生了变化）
watch(() => activeName.value, (newValue) => {
    if (newValue == 0) {
        // gethot().then(res => {
        //     tableData.value = res.data
        // })
        tableData.value = gethot()
    }
    else if (newValue == 1) {
        tableData.value = choiceData.value
    }
    else if (newValue == 2) {
        tableData.value = []
    }
})
//搜索
const onsearch = () => {
    // search(input.value).then(res => {
    //     tableData.value = res.data
    // })
}
//添加/删除
const onadd = (row) => {
    addchoice(row.name)
    // getchoice(row.name).then(res => {
    //         choiceData.value = res.data
    //         upchoice()
    //         if(activeName.value==1)
    //             tableData.value = choiceData.value
    //     })
}
const ondel = (row) => {
    delchoice(row.name)
    //更新显示
    // getchoice().then(res => {
    //         choiceData.value = res.data
    //          upchoice()
    //         if(activeName.value==1)
    //             tableData.value = choiceData.value
    //     })
}
//更新选择名单
const upchoice = () => {
    choiceName.value = []
    for (let a of choiceData.value)
        choiceName.value.push(a.name)
}
//刷新h
function geth() {
    //开始追踪h更新
    // getstockh(stockData.value.name).then(res => {
    //     stockDatah.value = res.data
    // })
    stockDatah.value = getstockh(stockData.value.name)
}
//查看详细信息
const ondetail = (row) => {
    // getstock(tableData.value[0].name).then(res => {
    //     stockData.value = res.data
    // })
    stockData.value = getstock(row.name)
    //重置k
    // getstockk(stockData.value.name).then(res => {
    //     stockDatak.value = res.data
    // })
    stockDatak.value = getstockk(stockData.value.name)
}
//初始化
// gethot().then(res => {
//     tableData.value = res.data
// })
tableData.value = gethot()
// getchoice().then(res => {
//     console.log(res.data)
// })
choiceData.value = getchoice()
upchoice()
// getstock(tableData.value[0].name).then(res => {
//     stockData.value = res.data
// })
stockData.value = getstock(tableData.value[0].name)
timerId = setInterval(geth, 3000);
// getstockk(stockData.value.name).then(res => {
//     stockDatak.value = res.data
// })
stockDatak.value = getstockk(stockData.value.name)
// getstockh(stockData.value.name).then(res => {
//     stockDatah.value = res.data
// })
stockDatah.value = getstockh(stockData.value.name)

//股票图切换
watch(() => activeChart.value, (newValue) => {
    if (newValue == "0") {
        // getstockh(stockData.value.name).then(res => {
        //     stockDatah.value = res.data
        // })
        stockDatah.value = getstockh(stockData.value.name)
        timerId = setInterval(geth, 3000);
    }
    else {
        //停止h追踪更新
        clearInterval(timerId);
    }
})
</script>
<style>
.chartbox {
    width: 100%;
    height: 430px;
    @apply p-0
}
</style>