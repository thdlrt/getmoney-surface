<template>
    <el-divider v-if="!stockData" v-loading.fullscreen.lock="fullscreenLoading" />
    <trade v-if="stockData" :name="stockData.name" :price="stockData.value" :id="stockData.code" ref="tradedialog" />
    <el-card v-if="stockData" class="box-card rounded-2xl" shadow="always" style="height:100%;position: relative;">
        <el-row :gutter="10" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;" class="overflow-hidden">
            <!-- 侧栏 -->
            <el-col :md="8" :sm="8" :xs="10" :offset="0" style="border-right: 2px solid #838383;height:100%;"
                class="overflow-hidden">
                <StockList @detail="ondetail" :label="'查看'" />
            </el-col>
            <!-- 主体 -->
            <el-col :md="16" :sm="16" :xs="14" :offset="0" class="overflow-x-hidden overflow-y-auto" style="height:100%;"
                :loading="loading">
                <!-- 概述 -->
                <div>
                    <div style="border-bottom: 2px solid #87afff;height:100%;" class="pb-2 flex justify-between">
                        <div>
                            <span class="text-xl ml-5">{{ stockData.name }}</span>
                            <span class="text-sm text-gray-500 ml-4">({{ stockData.code }})</span>
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
                                :style="{ color: stockData.value - stockData.open > 0 ? 'red' : 'green' }">
                                <span class="text-2xl">{{ stockData.value }}</span>
                                <up-two v-if="stockData.value - stockData.open > 0" theme="filled" size="28"
                                    fill="#ff0020" />
                                <down-two v-else theme="filled" size="28" fill="#447a04" />
                                <div style="display: inline-block;" class="ml-1">
                                    <div class="text-xs">{{ (stockData.value - stockData.open).toFixed(2) }}</div>
                                    <div class="text-xs">{{ stockData.rate }}</div>
                                </div>
                            </div>
                            <div class="h-[2px] bg-gray-200" style="width:80%;margin: 0 auto;" />
                            <div class="flex items-center justify-center text-xs text-gray-500 mt-1">
                                <span>{{ date }}</span>
                                <span class="ml-3">{{ time }}</span>
                            </div>
                        </el-col>
                        <el-col :ld="18" :md="14" :offset="0" class="overflow-hidden pb-3"
                            style="border-left: 2px solid #e4e7ed;">
                            <div class="flex flex-wrap items-center ml-5 mt-2" style="width:100%;">
                                <div v-for="(item, index) in stockInfo" :key="index" class="w-[150px] m-[1px]">
                                    <span class="text-sm">{{ item.name }}：</span>
                                    <span class="text-sm">{{ item.value }}</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!-- 选择图表 -->
                <el-tabs type="border-card" v-model="activeChart" class="mt-8" style="width:100%;height:100%"
                    :loading="loadingchart">
                    <el-tab-pane label="分时" name="0" class="chartbox">
                        <stock-chart ref="charth" :data="stockDatah" :type="0" :id="'chart1'" />
                    </el-tab-pane>
                    <el-tab-pane v-for="(item, index) in chartk" :name="item.name" :label="item.label" class="chartbox"
                        :key="index">
                        <stock-chart :ref="setItemRef" :type="1" :id="item.name" />
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
const activeChart = ref("5")
const stockData = ref(null)
const stockDatak = ref([])
const stockDatah = ref([])
const tradedialog = ref(null)
const loading = ref(false)
const fullscreenLoading = ref(true)
const stockInfo = ref([])
const date = ref('')
const time = ref('')
const loadingchart = ref(true)
var stockName = '浦发银行'
var stockCode = 'sh.600000'
var p = 0
const charth = ref(null)
const chartk = ref([{ label: '5分钟', name: '1', chart: null },
{ label: '15分钟', name: '2', chart: null },
{ label: '30分钟', name: '3', chart: null },
{ label: '60分钟', name: '4', chart: null },
{ label: '日K', name: '5', chart: null }])
//刷新h
function updatetime() {
    // 获取当前日期和时间
    var currentDate = new Date();
    // 获取年份
    var year = currentDate.getFullYear();
    // 获取月份（注意月份从0开始，0表示一月）
    var month = currentDate.getMonth() + 1;
    // 获取日期
    var day = currentDate.getDate();
    // 获取小时
    var hours = currentDate.getHours();
    // 获取分钟
    var minutes = currentDate.getMinutes();
    // 获取秒数
    var seconds = currentDate.getSeconds();
    var formattedHours = hours < 10 ? '0' + hours : hours;
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    date.value = year + '-' + month + '-' + day;
    time.value = formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
}
function updateinfo() {
    stockInfo.value = []
    stockInfo.value.push({ name: '今开', value: stockData.value.open })
    stockInfo.value.push({ name: '昨收', value: stockData.value.close })
    stockInfo.value.push({ name: '最高', value: stockData.value.high })
    stockInfo.value.push({ name: '最低', value: stockData.value.low })
    stockInfo.value.push({ name: '涨停价', value: stockData.value.up })
    stockInfo.value.push({ name: '跌停价', value: stockData.value.down })
    stockInfo.value.push({ name: '成交量(手)', value: stockData.value.volume })
    stockInfo.value.push({ name: '均价', value: stockData.value.mean })

}
//ref绑定
const setItemRef = (el) => {
    if (el && p < chartk.value.length) {
        chartk.value[p++].chart = el
    }
};

function geth() {
    getstock(stockName, stockCode).then(res => {
        stockData.value = res.data
        //开始追踪h更新
        if (stockName == '浦发银行') {
            getstockh(stockName, stockCode).then(res => {
                stockDatah.value = res
            })
            // stockDatah.value = {
            //     "data": [
            //         //时间   当前价  均价   交易量
            //         ["0930", 33.02, 33.02, 8200],
            //         ["0931", 33.08, 33.05, 54200],
            //         ["0932", 33.15, 33.083, 25700],
            //         ["0933", 33.17, 33.105, 20300],
            //         ["0934", 33.2, 33.124, 20500],
            //     ],
            //     "yestclose": 33.01, //前一天收盘价格
            // }
        }
        //stockDatah.value = getstockh(stockName, stockCode)
        //更新分时
        charth.value.reload(stockDatah.value)
        //更新时间
        updatetime()
        //更新股票info
        updateinfo()
        //完成加载
        loading.value = false
        fullscreenLoading.value = false
        //加载完成
        loadingchart.value = false
    })
}
function getk(month, stockCode, frequency) {
    getstockk(month, stockCode, frequency).then(res => {
        stockDatak.value = []
        let temp = res.data
        //数据格式化
        for (let a of temp) {
            if (frequency != 'd')
                stockDatak.value.push([format(a.time), a.open, a.close, a.low, a.high, a.volume, 0, 0, 0, 0])
            else
                stockDatak.value.push([a.date, a.open, a.close, a.low, a.high, a.volume, 0, 0, 0, 0])
        }
        //数据准备完成,加载k
        chartk.value[parseInt(activeChart.value) - 1].chart.reload(stockDatak.value)
        loadingchart.value = false
    })
}
//查看详细信息
const ondetail = (row, code) => {
    loading.value = true
    stockCode = code
    stockName = row.name
    geth()
    //等待加载
    loadingchart.value = true
    activeChart.value = "5"
    getk(12, stockCode, "d")
}
//初始化
//setInterval(geth, 5000)
geth()
getk(12, stockCode, "d")
//股票图切换
watch(() => activeChart.value, (newValue) => {
    loadingchart.value = true
    if (newValue == "0") {
        loadingchart.value = false
    }
    else if (newValue == "1") {
        getk(1, stockCode, "5")
    }
    else if (newValue == "2") {
        getk(1, stockCode, "15")
    }
    else if (newValue == "3") {
        getk(2, stockCode, "30")
    }
    else if (newValue == "4") {
        getk(6, stockCode, "60")
    }
    else if (newValue == "5") {
        getk(12, stockCode, "d")
    }
})
//time格式化
function format(timeString) {
    var year = timeString.substring(0, 4);
    var month = timeString.substring(4, 6);
    var day = timeString.substring(6, 8);
    var hours = timeString.substring(8, 10);
    var minutes = timeString.substring(10, 12);
    var seconds = timeString.substring(12, 14);
    return new Date(year, month - 1, day, hours, minutes, seconds);
}
</script>
<style>
.chartbox {
    width: 100%;
    height: 430px;
    @apply p-0
}
</style>