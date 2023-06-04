<template>
  <el-card class="box-card rounded-2xl mt-3" shadow="always" style="position: relative;height:100%;"
    :loading="loadingchart">
    <el-row :gutter="10" v-if="!showres" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;"
      class="overflow-hidden">
      <el-col :md="8" :sm="8" :xs="10" :offset="0" style="border-right: 2px solid #838383;height:100%;">
        <StockList @detail="getstock" :label="'回测'" />
      </el-col>
      <!-- 主体 -->
      <el-col :md="16" :sm="16" :xs="14" :offset="0" class="overflow-hidden" style="height:100%;">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-row :gutter="10">
            <el-col :lg="16" :md="16" :sm="12" :xs="12" :offset="0" class="overflow-y-auto overflow-x-hidden"
              style="height:100%;">
              <el-form-item prop="money" label="初始本金" class="mt-7 ml-5">
                <el-input type="text" v-model="form.money" placeholder="请输入本金" />
              </el-form-item>
              <el-form-item label="测试区间" prop="time" class="mr-5 ml-5">
                <el-date-picker v-model="form.time" type="daterange" range-separator="To" start-placeholder="开始时间"
                  end-placeholder="截止时间" />
              </el-form-item>
            </el-col>
            <!-- 右侧图表 -->
            <el-col :lg="8" :md="8" :sm="12" :xs="12" :offset="0" class="overflow-hidden ">
              <el-form-item prop="name" class=" mt-7">
                <el-input v-model="form.name" disabled placeholder="请选择要预测的股票" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" class="w-[120px] bg-blue-400"
                  :loading="loading">开始回测</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider />
        <el-alert v-if="show" title="注意" type="warning" description="请先选择回测本金及测试区间" show-icon />
        <div id="chart" ref="el_chart" style="width:100%;height:80%" />
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import StockList from '~/components/StockList.vue'
import * as echarts from 'echarts'
import { testStock } from '~/api/ai.js'
const formRef = ref(null)
const loading = ref(false)
const loadingchart = ref(false)
const show = ref(true)
const el_chart = ref(null)
var myChart
const getstock = (data, code) => {
  form.name = data.name
  form.code = code
}
const onSubmit = () => {
  showresult()
  show.value = false
  formRef.value.validate((valid) => {
    if (valid) {
      //防止重复点击
      loading.value = true
      //testStock()
      show.value = false
      showresult()
    } else {
      return false
    }
  })
}
const form = reactive({
  money: '',
  time: '',
  name:'',
  code: '',
})
// 表单验证
const rules = {
  money: [
    { required: true, message: '请输入本金', trigger: 'blur' },
  ],
  time: [
    { required: true, message: '请选择回测区间', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请选择要预测的股票', trigger: 'blur' },
  ]
}
//展示回测结果
function showresult() {
  let option = {
    color: ['#80FFA0', '#FF0087'],
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
      data: ['', '']
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
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Line 1',
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
              color: 'rgb(128, 255, 165)'
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [140, 232, 101, 264, 90, 340, 250]
      },
      {
        name: 'Line 2',
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
        data: [120, 282, 111, 234, 220, 340, 310]
      },
      {
        name: 'Line 3',
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
              color: 'rgb(55, 162, 255)'
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [320, 132, 201, 334, 190, 130, 220]
      },
      {
        name: 'Line 4',
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
              color: 'rgb(255, 0, 135)'
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [220, 402, 231, 134, 190, 230, 120]
      },
      {
        name: 'Line 5',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 191, 0)'
            },
            {
              offset: 1,
              color: 'rgb(224, 62, 76)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [220, 302, 181, 234, 210, 290, 150]
      }
    ]
  };
  myChart = echarts.init(document.getElementById('chart'));
  myChart.setOption(option);
  //绑定窗口大小变化
  resizeObserver = useResizeObserver(el_fchart, (entries) => {
    myChart.resize()
  })
}
</script>