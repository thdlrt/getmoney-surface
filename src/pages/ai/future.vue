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
                        <el-row :gutter="8">
                            <el-col :lg="3" :md="3" :sm="6" :offset="0" class="pb-1">
                                <el-button type="primary" :icon="icon" @click="onleft" class="float-left" />
                            </el-col>
                            <el-col :lg="8" :md="6" :sm="18" :offset="0">
                                <el-form-item prop="name" :span="24" style="width:100%">
                                    <el-input v-model="form.name" disabled placeholder="请选择要预测的股票" />
                                </el-form-item>
                            </el-col>
                            <el-col :lg="9" :md="10" :sm="16" :offset="0">
                                <el-form-item prop="time" :span="24" style="width: 100%">
                                    <el-select v-model="form.time" placeholder="请选择预测区间">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="4" :md="5" :sm="8" :offset="0">
                                <el-button type="primary" icon="Cpu" @click="onSubmit" :loading="iconloading"
                                    style="width:100%">开始预测</el-button>
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
            <el-row :gutter="14" v-else style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;"
                class="overflow-hidden">
                <el-col :sm="8" :xs="10" :offset="0" style="border-right: 2px solid #838383;height:100%;"
                    class="overflow-hidden">
                    <el-button type="danger" class="float-left" @click="onExit">退出</el-button>
                    <div class="mt-13 flex justify-center ">
                        <el-tag class="text-2xl font-bold" size="large" effect="dark">{{ form.name }}</el-tag>
                    </div>
                    <!-- 预测表格 -->
                    <div class="mt-3 ml-1 mr-2" style="width: 100%;height:100%;">
                        <el-table :data="tableData" stripe style="width: 100%;height:100%;">
                            <el-table-column prop="date" label="日期" />
                            <el-table-column prop="price" label="预期收益率" />
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
import { ref, watch, reactive } from 'vue'
import StockList from '~/components/StockList.vue'
import { getfuture } from '~/api/ai.js'
import { ElMessageBox } from 'element-plus'
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core'
const icon = ref('ArrowLeft')
const leftlen = ref(8)
const rightlen = ref(16)
const formRef = ref(null)
const iconloading = ref(false)
const step = ref(0)
const futuredata = ref(null)
const showres = ref(false)
const el_future = ref(null)
const tableData = ref([])
const options = ref([{
    value: 3,
    label: '未来3个月'
}, {
    value: 6,
    label: '未来6个月'
}])
const format = (percentage) => (percentage === 100 ? '' : `${percentage}%`)
var myChart
var resizeObserver
//选中股票
const ondetail = (row) => {
    form.name = row.name
    if (step.value == 0)
        step.value = 1
}
//预测表单f
const form = reactive({
    name: '',
    time: '',
})
// 表单验证
const rules = {
    name: [
        { required: true, message: '请选择股票', trigger: 'blur' },
    ],
    time: [
        { required: true, message: '请选择预测区间', trigger: 'blur' },
    ],
}
//加载结果
function endloading() {
    step.value = 3
    setTimeout(() => {
        showres.value = true
        setTimeout(() => {
            //获取当前年月份
            var date = new Date()
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var xlist = []
            for (let i = 0; i < form.time; i++) {
                xlist.push(year + '-' + month)
                month++
                if (month > 12) {
                    month = 1
                    year++
                }
            }
            //装载表格
            tableData.value = []
            for (let i = 0; i < futuredata.value.length; i++) {
                tableData.value.push({
                    date: xlist[i],
                    price: futuredata.value[i]
                })
            }
            //预测图
            var option = {
                color: ['#00DDFF'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: [form.name + ' 预期收益'],
                    textStyle: {
                        fontSize: 20 // 设置字体大小
                    },
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xlist
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}%' // 在刻度值后面加上百分号
                        },
                    }
                ],
                series: [{
                    name: form.name + ' 预期收益',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(0, 221, 255)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(77, 119, 255)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: futuredata.value
                }]
            };
            myChart = echarts.init(document.getElementById('future'));
            myChart.setOption(option);
            //绑定窗口大小变化
            setTimeout(() => {
                resizeObserver = useResizeObserver(el_future, (entries) => {
                    myChart.resize()
                })
            }, 5000)
        }, 100)
    }, 1000)
}
//TODO:绘制预测图表待更新
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
                console.log(form)
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
        form.date = ''
        form.name = ''
        resizeObserver.disconnect()
    })
}
//伸缩
const onleft = () => {
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
</script>
<style></style>