<template>
    <trade :name="props.name" :price="props.price" :id="props.price" ref="tradedialog" />
    <el-badge value="hot" class="item m-5">
        <el-card class="box-card w-100 h-135 rounded-xl relative" shadow="hover">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="card-header">
                        <span class="text-xl font-bold">{{ props.name }}</span>
                        <span class="text-gray-500 ml-2">({{ props.id }})</span>
                    </div>
                    <div class="flex justify-center items-center"
                        :style="{ color: props.changerate > 0 ? 'red' : 'green' }">
                        <span class="text-2xl">{{ props.price }}</span>
                        <up-two v-if="props.changerate > 0" theme="filled" size="28" fill="#ff0020" />
                        <down-two v-else theme="filled" size="28" fill="#447a04" />
                        <div style="display: inline-block;" class="ml-1">
                            <!-- <div class="text-xs">{{ props.changeprice }}</div> -->
                            <div class="text-xs">{{ props.changerate }}%</div>
                        </div>
                    </div>
                </div>
            </template>
            <div class="flex justify-center items-center">
                <div :id="index" ref="el_chart" class="w-75 h-100" />
            </div>
            <div class="absolute bottom-5" style="width:90%">
                <el-divider />
                <!-- 交易按钮 -->
                <div class="flex justify-center items-center">
                    <el-button-group>
                        <el-button type="primary" icon="Download" @click="tradedialog.buy()">买入</el-button>
                        <el-button type="danger" icon="Upload" @click="tradedialog.sell()">卖出</el-button>
                    </el-button-group>
                </div>
            </div>
        </el-card>
    </el-badge>
</template>
<script setup>
import { ref, defineProps, onMounted } from 'vue'
import trade from '~/components/trade.vue'
import { UpTwo, DownTwo } from '@icon-park/vue-next';
import { useResizeObserver } from '@vueuse/core'
import * as echarts from 'echarts';
const tradedialog = ref(null)
const el_chart = ref(null)
const props = defineProps({
    name: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0
    },
    id: {
        type: String,
        default: ''
    },
    changeprice: {
        type: Number,
        default: 0
    },
    changerate: {
        type: Number,
        default: 0
    },
    detail: {
        type: Array,
        default: function (v) { return }
    },
    index: {
        type: String,
        default: 0
    }
})
//雷达图
onMounted(() => {
    var myChart = echarts.init(document.getElementById(props.index));
    myChart.setOption(option);
    useResizeObserver(el_chart, (entries) => {
        myChart.resize()
    })
})
var option = {
    legend: {
        data: ['股票指数']
    },
    radar: {
        // shape: 'circle',
        indicator: props.detail
    },
    series: [
        {
            type: 'radar',
            name: '股票指数',
            data: [{
                value: props.detail.map(item => item.value),
            }
            ]
        }
    ]
};
</script>