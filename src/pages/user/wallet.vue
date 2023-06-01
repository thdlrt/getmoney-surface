<template>
    <trade :name="choice.name" :price="choice.price" :id="choice.id" ref="tradedialog"/>
    <div style="height:100%;position: relative;">
        <el-row :gutter="0" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;"
            class="overflow-y-auto overflow-x-hidden">
            <el-col :lg="12" :md="12" :sm="24" :xs="24" :offset="0" class="overflow-hidden" style="height:100%;">
                <!-- 左侧充值 -->
                <el-card class="box-card mr-3 rounded-xl overflow-y-auto overflow-x-hidden" style="height:100%;">
                    <template #header>
                        <div class="card-header">
                            <span class="text-xl font-bold text-gray-700">在线充值</span>
                        </div>
                    </template>
                    <!-- 金额选择 -->
                    <el-alert title="欢迎！" type="info" description="请先选择充值金额" show-icon :closable="false"
                        class="mt-3 mb-3" />
                    <div class="flex justify-center" style="width:100%">
                        <el-radio-group v-model="money_choice">
                            <el-radio v-for="(item, index) in num" :label="index" class="select" border>
                                <div class="flex justify-center ml-1">
                                    <span>￥</span>
                                    <span class="text-2xl font-bold">{{ item }}</span>
                                </div>
                            </el-radio>
                            <!-- 自定义金额 -->
                            <el-radio :label="num.length" class="h-18 w-90 m-5 rounded-xl" border>
                                <span class="text-gray-500 m-6 text-sm">自定义金额</span>
                                <el-input-number v-model="money" :min="100" :max="1000000" step="500"
                                    controls-position="right" size="large" @change="handleChange" />
                            </el-radio>
                        </el-radio-group>
                    </div>
                    <!-- 充值按钮 -->
                    <el-divider />
                    <el-button type="primary" icon="Coin" @click="onadd" class="w-30 h-10 " :loading="loadingleft"
                        style="display:block;margin: 50px auto;">充值</el-button>
                </el-card>
            </el-col>
            <!-- 右侧信息及提现 -->
            <el-col :lg="12" :md="12" :sm="24" :xs="24" :offset="0" class="overflow-hidden" style="height:100%;">
                <el-card class="box-card mr-3 rounded-xl overflow-y-auto overflow-x-hidden" style="height:100%;">
                    <template #header>
                        <div class="card-header">
                            <span class="text-xl font-bold text-gray-700">持仓状况</span>
                        </div>
                    </template>
                    <!-- 持仓状况 -->
                    <el-table :data="filterTableData" style="width: 100%">
                        <el-table-column label="股票名称" prop="name" />
                        <el-table-column label="当前股价" prop="price" />
                        <el-table-column label="持仓数量" prop="num" />
                        <el-table-column align="right" min-width="120">
                            <template #header>
                                <el-input v-model="search" placeholder="搜索" />
                            </template>
                            <template #default="scope">
                                <!-- 交易按钮 -->
                                <el-button-group>
                                    <el-button type="primary" icon="Download" @click="onbuy(scope.row)">买入</el-button>
                                    <el-button type="danger" icon="Upload" @click="onsell(scope.row)">卖出</el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { addmoney, getmoney, ownstock } from '~/api/user.js'
import trade from '~/components/trade.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const tableData = ref([])
const money_choice = ref(0)
const money = ref(100)
const num = ref([500, 1000, 5000, 10000])
const loadingleft = ref(false)
const search = ref('')
const tradedialog = ref(null)
const choice = ref({
    name: '',
    price: 0,
    id: 0,
})
//初始化表格
// ownstock().then(res => {
//     tableData.value = res.data
// })
tableData.value = ownstock()
const onadd = () => {
    loadingleft.value = true
    let res = 0
    if (money_choice.value == num.value.length)
        res = money.value
    else
        res = num.value[money_choice.value]
    ElMessageBox.confirm(
        '此操作将充值' + res + '元, 是否继续?',
        '注意',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            addmoney(res).then(res => {
                ElMessage({
                    message: '充值成功，请前往配置资产',
                    type: 'success',
                })
            }).finally(() => {
                loadingleft.value = false
            })
        })
}
const handleChange = (value) => {
    console.log(value)
}
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
//交易
const onbuy = (row) => {
    choice.value = row
    tradedialog.value.buy()
}
const onsell = (row) => {
    choice.value = row
    tradedialog.value.sell()
}
</script>
<style>
.select {
    @apply h-18 w-40 m-5 rounded-xl;
}
</style>