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
            <!-- 用户画像 -->
            <el-col :md="10" :offset="0">
                <el-card class="box-card rounded-2xl" shadow="hover">
                    <div id="user" class="h-100 " ref="el_user"></div>
                </el-card>
            </el-col>
        </el-row>
        <div class="h-4"></div>
        <!-- 第三行 -->
        <el-row :gutter="20">
            <!-- 七日收益 -->
            <el-col :md="14" :offset="0">
                <el-card class="box-card rounded-2xl" shadow="hover">
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
                                    <el-col :span="6" :offset="0">
                                        <TrendIcon :value="item.income" />
                                    </el-col>
                                    <el-col :span="18" :offset="0">
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
        <el-row :gutter="20">
            <el-col :md="14" :offset="0">
                <el-card class="box-card rounded-2xl" shadow="hover">
                    <div class="h-5 flex justify-center items-center">
                        <span class="font-bold text-2xl">历史投资记录</span>
                    </div>
                    <el-divider />
                    <div class="h-105">
                        <HistoryForm :value="userdata.transactions" />
                    </div>
                </el-card>
            </el-col>
            <!-- 资产配置 -->
            <el-col :md="10" :offset="0">
                <el-card class="box-card rounded-2xl" shadow="hover">
                    <div id="asset" class="h-122 " ref="el_asset"></div>
                </el-card>
            </el-col>
        </el-row>
        <div class="h-4"></div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { gettradeinfo, ownstock, getinfo } from '~/api/user.js'
import { search } from '~/api/data.js'
import { useResizeObserver } from '@vueuse/core'
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import TrendIcon from '~/components/TrendIcon.vue';
import HistoryForm from '~/components/HistoryForm.vue';
//滚动动画
import CountTo from '~/components/CountTo.vue';
const firstline = ref([])
const userdata = ref({
    week: [{
        income: 0,
        date: '0000-00-00',
        detail: [{
            name: '',
            income: 0,
        }]//当日收益详情
    }],
    acincome: 0,
    rate: 0,
    acrate: 0,
    transactions: [{
        date: '0000-00-00',
        value: 0,
        detail: [{
            name: '',
            income: 0,
        }],//不同股票收益详情
        income: 0,
    }],//交易记录
    trend: [{
        date: '0000-00-00',
        value: 0,
    }],//资产走势
    asset: [{
        name: '',
        value: 0,
    }],//资产分布
})
const weekIndex = ref(0)
const ownStock = ref([])
//echart配置
var trendChart = null;
var assetChart = null;
var weekChart = null;
var userChart = null;
const el_trend = ref(null)
const el_asset = ref(null)
const el_week = ref(null)
const el_user = ref(null)
var valuelist = []
//资产配置
//资产走势图数据
let begin = 0
let trend = [['date', 'value']]
onMounted(() => {
    //用户画像加载
    getinfo().then((res) => {
        var grade = res.grade
        var option_user = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    center: ['50%', '75%'],
                    radius: '90%',
                    min: 0,
                    max: 1,
                    splitNumber: 8,
                    axisLine: {
                        lineStyle: {
                            width: 6,
                            color: [
                                [0.25, '#FF6E76'],
                                [0.5, '#FDDD60'],
                                [0.75, '#58D9F9'],
                                [1, '#7CFFB2']
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 20,
                        offsetCenter: [0, '-60%'],
                        itemStyle: {
                            color: 'inherit'
                        }
                    },
                    axisTick: {
                        length: 12,
                        lineStyle: {
                            color: 'inherit',
                            width: 2
                        }
                    },
                    splitLine: {
                        length: 20,
                        lineStyle: {
                            color: 'inherit',
                            width: 5
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 20,
                        distance: -60,
                        rotate: 'tangential',
                        formatter: function (value) {
                            if (value === 0.875) {
                                return '激进型C4';
                            } else if (value === 0.625) {
                                return '稳健型C3';
                            } else if (value === 0.375) {
                                return '谨慎型C2';
                            } else if (value === 0.125) {
                                return '保守型C1';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-10%'],
                        fontSize: 20
                    },
                    detail: {
                        fontSize: 30,
                        offsetCenter: [0, '-35%'],
                        valueAnimation: true,
                        formatter: function (value) {
                            return Math.round(value * 100) + '';
                        },
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: (grade - 20) / 80,
                            name: '用户画像'
                        }
                    ]
                }
            ]
        };
        userChart = echarts.init(document.getElementById('user'));
        userChart.setOption(option_user);
        useResizeObserver(el_user, (entries) => {
            userChart.resize()
        })
    })
    //用户资产配置图加载
    ownstock().then((res) => {
        ownStock.value = res.stock;
        // 生成 Promise 数组
        const promises = ownStock.value.map((stock) => {
            return search(stock.name).then((res) => {
                stock.price = res.data[0].value;
            });
        });
        // 等待所有 Promise 完成
        Promise.all(promises).then(() => {
            //计算每一项的总价值
            for (let a of ownStock.value) {
                if (a.value == 0)
                    continue
                valuelist.push({
                    name: a.name,
                    value: a.price * a.value
                })
            }
            //资产配置图
            var option_assert = {
                dataset: {
                    source: valuelist
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
            //资产配置图初始化
            assetChart = echarts.init(document.getElementById('asset'))
            assetChart.setOption(option_assert)
            useResizeObserver(el_asset, (entries) => {
                assetChart.resize()
            })
        });
    });
    //其他图加载
    gettradeinfo().then(res => {
        userdata.value = res
        console.log(userdata.value)
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
            name: '每股收益率',
        }, {
            value: rate[3],
            name: '累计收益率',
        }]
        //日期转化为数字
        userdata.value.trend.reverse()
        userdata.value.trend.forEach((item) => {
            let date = new Date(item.date);
            if (begin == 0) {
                begin = date.getTime()
            }
            trend.push([(date.getTime() - begin) / 86400000, item.value])
        })
        // 假设已有数据有 n 条，需要向前预测 m 个时间单位
        console.log(trend)
        let n = trend.length;
        let m = 7;
        var showpredict = 'line';
        var startX = trend[n - 1][0];
        var endX = startX + m - 1;
        var startY = ecStat.regression('linear', trend, '1,2').parameter.gradient * startX + ecStat.regression('linear', trend, '1,2').parameter.intercept; // 预测区间的起点 y 坐标
        var endY = ecStat.regression('linear', trend, '1,2').parameter.gradient * endX + ecStat.regression('linear', trend, '1,2').parameter.intercept; // 预测区间的终点 y 坐标
        console.log(startX, startY, endX, endY)
        //如果区间太小不预测
        if (trend.length < 4) {
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
                },
                axisLabel: {
                    formatter: function (value) {
                        return value.toFixed(2); // 保留两位小数
                    }
                },
                min: 'dataMin', // 设置Y轴的最小值为最小数据值
                max: 'dataMax', // 设置Y轴的最大值为最大数据值
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
        //七日收益率
        userdata.value.week.reverse()
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
        //资产走势初始化
        trendChart = echarts.init(document.getElementById('trend'));
        trendChart.setOption(option_trend);
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
        useResizeObserver(el_week, (entries) => {
            weekChart.resize()
        })
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
</script>