<template>
    <div>
        <!-- 第一行 -->
        <el-row :gutter="20">
            <el-col :lg="6" :sm="12" :offset="0" v-for="(item, index) in firstline" :key="index">
                <el-card class="box-card rounded-2xl" shadow="hover">
                    <div>
                        <el-row :gutter="6">
                            <!-- 左侧图标 -->
                            <el-col :span="7" :offset="0">
                                <TrendIcon :value="item.value" />
                            </el-col>
                            <!-- 右侧数据 -->
                            <el-col :span="17" :offset="0">
                                <div class="font-bold text-3xl flex items-center justify-center">
                                    <CountTo :num="item.value" />
                                    <span v-if="index < 2">￥</span>
                                    <span v-else>%</span>
                                </div>
                                <div class="flex items-center justify-center">
                                    <span class="h-[1px] w-16 bg-gray-200"></span>
                                    <span class="font-bold text-gray-500 whitespace-nowrap">{{ item.name }}</span>
                                    <span class="h-[1px] w-16 bg-gray-200"></span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="h-4"></div>
        <!-- 第二行 -->
        <el-row :gutter="20">
            <!-- 线性回归 -->
            <el-col :md="14" :offset="0">
                <el-card class="box-card rounded-2xl" shadow="hover">
                    <div id="trend" class="h-100 " ref="el_trend"></div>
                </el-card>
            </el-col>
            <!-- 资产配置 -->
            <el-col :md="10" :offset="0">
                <el-card class="box-card rounded-2xl" shadow="hover">
                    <div id="asset" class="h-100 " ref="el_asset"></div>
                </el-card>
            </el-col>
        </el-row>
        <div class="h-4"></div>
        <!-- 第三行 -->
        <el-row :gutter="20">
            <!-- 七日收益 -->
            <el-col :md="14" :offset="0">
                <el-card class="box-card c" shadow="hover">
                    <div id="week" class="h-100 " ref="el_week"></div>
                </el-card>
            </el-col>
            <!-- 详细情况 -->
            <el-col :md="10" :offset="0">
                <el-card class="box-card rounded-2xl" shadow="hover">
                    <div class="h-10 flex items-center justify-center">
                        <span class="font-bold text-md">收益详情</span>
                    </div>
                    <div class="h-90 overflow-y-scroll">
                        <div v-for="(item, index) in userdata.week[weekIndex].detail" :key="index">
                            <el-card class="box-card rounded-2xl" shadow="hover">
                                <el-row :gutter="20" class="items-center">
                                    <el-col :span="8" :offset="0">
                                        <TrendIcon :value="item.income" />
                                    </el-col>
                                    <el-col :span="16" :offset="0">
                                        <div class="flex justify-between items-center">
                                            <span class="font-bold text-md text-gray-500">{{ item.name }}</span>
                                            <span class="font-bold text-3xl">{{ item.income }}￥</span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-card>
                            <div class="h-4"></div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="h-4"></div>
        <!-- 第四行 -->
        <el-card class="box-card rounded-2xl" shadow="hover">
            <div class="h-5 flex justify-center items-center">
                <span class="font-bold text-2xl">历史投资记录</span>
            </div>
            <el-divider />
            <div class="h-105">
                <HistoryForm :value="userdata.transactions" />
            </div>
        </el-card>
        <div class="h-4"></div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { gettradeinfo } from '~/api/user.js'
import { useResizeObserver } from '@vueuse/core'
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import TrendIcon from '~/components/TrendIcon.vue';
import HistoryForm from '~/components/HistoryForm.vue';
//滚动动画
import CountTo from '~/components/CountTo.vue';
const firstline = ref([])
const userdata = ref(null)
const weekIndex = ref(0)
//资产走势图数据
let begin = 0
let trend = [['date', 'value']]
// gettradeinfo().then(res => {
//     userdata.value = res.data
// })
userdata.value = gettradeinfo()
//数据提取处理
let rate = [userdata.value.week[userdata.value.week.length - 1].income, userdata.value.acincome, userdata.value.rate, userdata.value.acrate]
//第一行初始化
firstline.value = [{
    value: rate[0],
    name: '昨日收益',
}, {
    value: rate[1],
    name: '累计收益',
}, {
    value: rate[2],
    name: '七日年化率',
}, {
    value: rate[3],
    name: '累计收益率',
}]
//日期转化为数字
userdata.value.trend.forEach((item) => {
    let date = new Date(item.date);
    if (begin == 0) {
        begin = date.getTime()
    }
    trend.push([(date.getTime() - begin) / 86400000, item.value])
})

//echart配置
var trendChart = null;
var assetChart = null;
var weekChart = null;
const el_trend = ref(null)
const el_asset = ref(null)
const el_week = ref(null)
//echart渲染
onMounted(() => {
    //资产走势初始化
    trendChart = echarts.init(document.getElementById('trend'));
    trendChart.setOption(option_trend);
    //资产配置图初始化
    assetChart = echarts.init(document.getElementById('asset'))
    assetChart.setOption(option_assert)
    //七日收益图初始化
    weekChart = echarts.init(document.getElementById('week'))
    weekChart.setOption(option_week)
    weekChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: weekIndex.value
    });
    //点击事件
    weekChart.on('click', function (params) {
        if (params.componentType === 'series' && params.seriesType === 'bar') {
            // 获取被点击的柱子在数据中的索引
            weekIndex.value = params.dataIndex;
            //高亮选中
            // 先将所有柱子的 emphasis 样式清除
            weekChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0
            });
            // 然后设置被点击柱子的 emphasis 样式为红色
            weekChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: params.dataIndex
            });
        }
    });
    //窗口监听
    useResizeObserver(el_trend, (entries) => {
        trendChart.resize()
    })
    useResizeObserver(el_asset, (entries) => {
        assetChart.resize()
    })
    useResizeObserver(el_week, (entries) => {
        weekChart.resize()
    })
})

//还原时间戳
function formatDate(timestamp) {
    const date = new Date(timestamp * 86400000 + begin);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year + '-' + month + '-' + day;
}
// 假设已有数据有 n 条，需要向前预测 m 个时间单位
let n = trend.length;
let m = 7;
var showpredict = 'line';
var startX = trend[n - 1][0];
var endX = startX + m - 1;
var startY = ecStat.regression('linear', trend, '1,2').parameter.gradient * startX + ecStat.regression('linear', trend, '1,2').parameter.intercept; // 预测区间的起点 y 坐标
var endY = ecStat.regression('linear', trend, '1,2').parameter.gradient * endX + ecStat.regression('linear', trend, '1,2').parameter.intercept; // 预测区间的终点 y 坐标
//如果区间太小不预测
if (trend.length < 7) {
    showpredict = 'none'
}

//资产走势图配置
echarts.registerTransform(ecStat.transform.regression);
var option_trend = {
    dataset: [
        {
            source: trend,
            // 预测区间
        },
        {
            transform: {
                type: 'ecStat:regression'
            },
        },
        {
            source: [[startX, startY], [endX, endY]],
        }
    ],
    title: {
        text: '资产走势',
        left: 'center'
    },
    legend: {
        bottom: 5
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    xAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        axisLabel: {
            formatter: function (value) {
                return formatDate(value);
            },
        },
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [
        {
            name: '实际状况',
            type: 'scatter'
        },
        {
            name: '资产预测',
            type: 'line',
            datasetIndex: 1,
            symbolSize: 0.1,
            symbol: 'circle',
            label: { show: true, fontSize: 16 },
            labelLayout: { dx: -20 },
            encode: { label: 2, tooltip: 1 }
        },
        {
            name: 'predict',
            type: showpredict,
            datasetIndex: 2,
            symbol: 'none',
            lineStyle: {
                width: 1,
                type: 'dashed'
            },
            encode: { x: 0, y: 1 }
        }
    ]
};
//资产配置图
var option_assert = {
    dataset: {
        source: userdata.value.asset
    },
    title: {
        text: '资产配置',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        bottom: '5%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            }
        }
    ]
};
//七日收益率
var option_week = {
    dataset: {
        source: userdata.value.week
    },
    title: {
        text: '近七日收益',
        left: 'center',
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            type: 'bar',
            encode: {
                x: 'date',
                y: 'income'
            },
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            emphasis: {
                itemStyle: {
                    color: 'red'
                }
            }
        }
    ]
};

</script>