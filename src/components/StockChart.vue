<template>
    <div :id="props.id" ref="el_chart" style="height: 100%;width: 100%;" />
</template>
<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import * as echarts from 'echarts';
import { initMOption, initKOption } from './stockchart/k-line.js';
const el_chart = ref(null)
var mChart = null
var kChart = null
const props = defineProps({
    //0为分时，1为k线
    type: {
        type: Number,
        default: 0
    },
    id: {
        type: String,
        default: null
    }
})
//初始化图
const reload = (data) => {
    if(!data)return
    if (props.type == 0) {
        if (!mChart) {
            mChart = echarts.init(document.getElementById(props.id));
            useResizeObserver(el_chart, (entries) => {
                mChart.resize()
            })
        }
        console.log(data)
        mChart.setOption(initMOption(data, 'hs'));
    }
    else {
        if (!kChart) {
            kChart = echarts.init(document.getElementById(props.id));
            useResizeObserver(el_chart, (entries) => {
                kChart.resize()
            })
        }
        kChart.setOption(initKOption(data));
    }
}
defineExpose({
    reload,
})
</script>
