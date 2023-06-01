<template>
    <trade :name="stockData.name" :price="stockData.price" :id="stockData.price" ref="tradedialog"/>
    <el-card class="box-card rounded-2xl" shadow="always" style="height:100%;position: relative;">
        <el-row :gutter="10" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;" class="overflow-hidden">
            <!-- 侧栏 -->
            <el-col :md="8" :sm="8" :xs="10" :offset="0" style="border-right: 2px solid #838383;height:100%;"
                class="overflow-hidden">
                <StockList @detail="ondetail" :label="'查看'" />
            </el-col>
            <!-- 主体 -->
            <el-col :md="16" :sm="16" :xs="14" :offset="0" class="overflow-x-hidden overflow-y-auto" style="height:100%;">
                <!-- 概述 -->
                <div>
                    <div style="border-bottom: 2px solid #87afff;height:100%;" class="pb-2 flex justify-between">
                        <div>
                            <span class="text-xl ml-5">{{ stockData.name }}</span>
                            <span class="text-sm text-gray-500 ml-4">({{ stockData.id }})</span>
                        </div>
                        <!-- 交易按钮 -->
                        <el-button-group>
                            <el-button type="primary" icon="Download" @click="tradedialog.buy()">买入</el-button>
                            <el-button type="danger" icon="Upload" @click="tradedialog.sell()">卖出</el-button>
                        </el-button-group>
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
import { getstock, getstockh, getstockk } from '~/api/data.js'
import { UpTwo, DownTwo } from '@icon-park/vue-next';
import StockChart from '~/components/StockChart.vue'
import StockList from '~/components/StockList.vue'
import trade from '~/components/trade.vue'
const activeChart = ref("0")
const stockData = ref(null)
const stockDatak = ref([])
const stockDatah = ref(null)
const tradedialog = ref(null)
var timerId
//TODO实时刷新
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
    console.log(row)
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
// getstock("000001").then(res => {
//     stockData.value = res.data
// })
//默认上证指数
stockData.value = getstock("000001")
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