<template>
    <el-card class="box-card rounded-2xl" shadow="always" style="height:100%;position: relative;">
        <transition name="fade">
            <el-row :gutter="10" v-if="!showres" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;"
                class="overflow-hidden">
                <!-- 侧栏 -->
                <el-col :span="leftlen" :offset="0" style="border-right: 2px solid #838383;height:100%;"
                    class="overflow-hidden">
                    <StockList @detail="ondetail" :label="'预测'" />
                </el-col>
                <!-- 主体 -->
                <el-col :span="rightlen" :offset="0" class="overflow-hidden" style="height:100%;">
                    <!-- 表单 -->
                    <el-form :model="form" :rules="rules" ref="formRef" style="border-bottom: 2px solid #e4e7ed;"
                        class="mr-8">
                        <el-row :gutter="12">
                            <el-col :lg="2" :md="4" :sm="5" :offset="0" class="pb-1">
                                <el-button type="primary" :icon="icon" @click="onleft" class="float-left" />
                            </el-col>
                            <el-col :lg="4" :md="6" :sm="8" :offset="0">
                                <el-form-item prop="name" :span="24">
                                    <el-input v-model="form.name" disabled placeholder="请选择股票" />
                                </el-form-item>
                            </el-col>
                            <el-col :lg="10" :md="14" :sm="11" :offset="0">
                                <el-form-item prop="date" :span="24">
                                    <el-date-picker v-model="form.date" type="daterange" unlink-panels range-separator="To"
                                        start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" />
                                </el-form-item>
                            </el-col>
                            <el-col :lg="5" :md="16" :sm="16" :offset="0">
                                <el-form-item prop="alogrithm" :span="24">
                                    <el-select v-model="form.alogrithm" multiple placeholder="请选择预测模型">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="3" :md="8" :sm="8" :offset="0">
                                <el-button type="primary" icon="Cpu" @click="onSubmit"
                                    :loading="iconloading">开始预测</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                    <!-- 预测主题内容 -->
                    <div class="overflow-x-hidden overflow-y-auto" style="width: 100%;height:100%">
                        <!-- 进度条 -->

                        <el-steps :active="step" align-center class="mt-40" finish-status="success">
                            <el-step title="选择股票" description="点击预测按钮选择股票" />
                            <el-step title="配置信息" description="选择时间区间与模型" />
                            <el-step title="训练模型" description="点击开始预测后服务器进行训练并预测股价" />
                        </el-steps>
                        <div v-if="iconloading" style="width:100%;" class="flex justify-center mt-10 ml-10">
                            <el-progress :percentage="100" :format="format" :indeterminate="true" style=" width:50%;" />
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!-- 预测结果 -->
            <el-row :gutter="10" v-else style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;"
                class="overflow-hidden">
                <el-col :sm="8" :xs="10" :offset="0" style="border-right: 2px solid #838383;height:100%;"
                    class="overflow-hidden">
                    <el-button type="danger" class="float-left" @click="onExit">退出</el-button>
                    <div class="mt-13 flex justify-center ">
                        <el-tag class="text-2xl font-bold" size="large" effect="dark">{{ form.name }}</el-tag>
                    </div>
                    <!-- 预测表格 -->
                    <div class="mt-3 ml-1 mr-2" style="width: 100%;height:100%;">
                        <el-tabs v-model="activealg" class="demo-tabs">
                            <el-tab-pane v-for="(item, index) in form.alogrithm" :key="index" :label="item" :name="index" />
                        </el-tabs>
                        <el-table :data="tableData" stripe style="width: 100%;height:100%;">
                            <el-table-column prop="date" label="日期" />
                            <el-table-column prop="name" label="价格" />
                        </el-table>
                    </div>
                </el-col>
                <!-- future图 -->
                <el-col :sm="16" :xs="14" :offset="0" class="overflow-hidden">
                    <div id="future" style="width:100%;height:100%;" ref="el_future" />
                </el-col>
            </el-row>
        </transition>
    </el-card>
</template>
<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
import StockList from '~/components/StockList.vue'
import { getalogrithm, getfuture } from '~/api/ai.js'
import { ElMessageBox } from 'element-plus'
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core'
const icon = ref('ArrowLeft')
const leftlen = ref(8)
const rightlen = ref(16)
const formRef = ref(null)
const options = ref([])
const iconloading = ref(false)
const step = ref(0)
const futuredata = ref(null)
const showres = ref(false)
const el_future = ref(null)
const activealg = ref(0)
const tableData = ref([])
const format = (percentage) => (percentage === 100 ? '' : `${percentage}%`)
var myChart
var resizeObserver
//监听
watch(() => activealg.value, (newValue) => {
    tableData.value = []
    for (let i = 0; i < futuredata.value[newValue + 1].length; i++) {
        tableData.value.push({
            date: futuredata.value[newValue + 1][i][1],
            name: futuredata.value[newValue + 1][i][2],
        })
    }
})
//初始化算法列表
// getalogrithm().then(res=>{
//     options.value = res.data
// })
options.value = getalogrithm()
//选中股票
const ondetail = (row) => {
    form.name = row.name
    if (step.value == 0)
        step.value = 1
}
//预测表单f
const form = reactive({
    name: '',
    date: '',
    alogrithm: [],
})
// 表单验证
const rules = {
    name: [
        { required: true, message: '请选择日期', trigger: 'blur' },
    ],
    date: [
        { required: true, message: '请选择日期', trigger: 'blur' },
    ],
    alogrithm: [
        { required: true, message: '请至少选择一种预测算法', trigger: 'blur' },
    ],
}
const shortcuts = [
    {
        text: '未来一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '未来两周',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 2 * 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '未来一月',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '未来三月',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3 * 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
]
function endloading() {
    step.value = 3
    setTimeout(() => {
        showres.value = true
        setTimeout(() => {
            //initialize
            tableData.value = []
            for (let i = 0; i < futuredata.value[1].length; i++) {
                tableData.value.push({
                    date: futuredata.value[1][i][1],
                    name: futuredata.value[1][i][2],
                })
            }
            console.log(tableData.value)
            myChart = echarts.init(document.getElementById('future'));
            run(futuredata.value)
            //绑定变化
            setTimeout(() => {
                resizeObserver = useResizeObserver(el_future, (entries) => {
                    myChart.resize()
                })
            }, 5000)
        }, 100)
    }, 1000)
}
//提交表单
const onSubmit = () => {
    ElMessageBox.confirm(
        '预测股票需要一段时间，一旦开始不能取消，是否继续？',
        '注意',
        {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        formRef.value.validate((valid) => {
            if (valid) {
                iconloading.value = true
                step.value = 2
                // getfuture(form).then(res => {
                //     futuredata.value = res.data
                //     //结束动画
                //     endloading()
                // }).finally(() => {
                //     iconloading.value = false
                // })
                futuredata.value = []
                futuredata.value = getfuture(form)
                iconloading.value = false
                endloading()
            }
            else
                return false
        })
    })
}
//退出按钮
const onExit = () => {
    ElMessageBox.confirm(
        '是否退出？预测结果不会保存！',
        '注意',
        {
            confirmButtonText: '退出',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        step.value = 0
        showres.value = false
        form.alogrithm = ''
        form.date = ''
        form.name = ''
        resizeObserver.disconnect()
    })
}
//伸缩
const onleft = () => {
    console.log(form.alogrithm)
    if (icon.value === 'ArrowLeft') {
        icon.value = 'ArrowRight'
        smoothTransition(8, 0, 0.2, leftlen)
        smoothTransition(16, 24, 0.2, rightlen)
    } else {
        icon.value = 'ArrowLeft'
        smoothTransition(0, 8, 0.2, leftlen)
        smoothTransition(24, 16, 0.2, rightlen)
    }
}

const smoothTransition = (start, end, duration, target) => {
    const range = end - start
    const interval = duration * 1000 / Math.abs(range)
    const stepSize = range > 0 ? 1 : -1
    let currentValue = start

    const transitionTimer = setInterval(() => {
        currentValue += stepSize
        target.value = currentValue

        if (currentValue === end) {
            clearInterval(transitionTimer)
        }
    }, interval)
}
//future预测图
function run(data) {
    let temp = []
    for (let a of data) {
        temp = temp.concat(a)
    }
    data = temp
    const alog = [
        'asd',
        'qwe',
    ];//=form.alogrithm
    const datasetWithFilters = [];
    const seriesList = [];
    echarts.util.each(alog, function (country) {
        var datasetId = 'dataset_' + country;
        //自动生成过滤器
        datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
                type: 'filter',
                config: {
                    and: [
                        //第二个条件是筛选 'Country' 维度等于当前循环的国家名称。
                        { dimension: 'name', '=': country }
                    ]
                }
            }
        })
        seriesList.push({
            type: 'line',
            datasetId: datasetId,
            showSymbol: false,
            name: country,
            endLabel: {
                show: true,
                formatter: function (params) {
                    return params.value[0];
                }
            },
            labelLayout: {
                moveOverlap: 'shiftY'
            },
            emphasis: {
                focus: 'series'
            },
            encode: {
                x: 'date',
                y: 'price',
                label: ['name', 'price'],
                itemName: '日期',
                tooltip: ['price']
            }
        });
    });
    let option = {
        animationDuration: 5000,
        dataset: [
            {
                id: 'dataset_raw',
                source: data
            },
            ...datasetWithFilters//将过滤器对象展开
        ],
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            nameLocation: 'middle',
        },
        yAxis: {
            name: '价格(元)'
        },
        grid: {
            right: 140
        },
        series: seriesList
    };
    myChart.setOption(option);
}
</script>
<style></style>