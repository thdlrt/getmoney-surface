<template>
    <trade :name="choice.name" :price="choice.price" :id="choice.code" ref="tradedialog" @update="up" />
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
                <el-card class="box-card rounded-xl overflow-y-auto overflow-x-hidden" style="height:60%;">
                    <template #header>
                        <div class="card-header">
                            <span class="text-xl font-bold text-gray-700">持仓状况</span>
                        </div>
                    </template>
                    <!-- 持仓状况 -->
                    <el-table :data="filterTableData" style="width: 100%">
                        <el-table-column label="股票名称" prop="name" />
                        <el-table-column label="当前股价" prop="price" />
                        <el-table-column label="持仓数量" prop="value" />
                        <el-table-column label="持仓建议">
                            <template #default="scope">
                                <el-tooltip v-if="Math.floor(scope.row.price + scope.row.num * 2 - 1) % 3 == 0"
                                    class="box-item" effect="light" content="建议平仓（保持持有量）" placement="bottom-start">
                                    <el-icon class="mr-3">
                                        <Switch class="text-2xl font-bold" />
                                    </el-icon>
                                </el-tooltip>
                                <el-tooltip v-if="Math.floor(scope.row.price + scope.row.num * 2 - 1) % 3 == 1"
                                    class="box-item" effect="light" content="建议加仓（增加持有量）" placement="bottom-start">
                                    <div class="flex font-bold text-red-400 justify-center items-center">
                                        <el-icon class="mr-3">
                                            <Upload class="text-2xl" />
                                        </el-icon>
                                        <span>(-{{
                                            Math.floor((random * scope.row.num * scope.row.price + 2) / (scope.row.price * 3
                                                - 2))
                                        }})</span>
                                    </div>
                                </el-tooltip>
                                <el-tooltip v-if="Math.floor(scope.row.price + scope.row.num * 2 - 1) % 3 == 2"
                                    class="box-item" effect="light" content="建议减仓（减少持有量）" placement="bottom-start">
                                    <div class="flex font-bold text-green-400 justify-center items-center">
                                        <el-icon class="mr-3">
                                            <Download class="text-2xl" />
                                        </el-icon>
                                        <span>(-{{
                                            Math.floor((random * scope.row.num * scope.row.price + 2) / (scope.row.price * 3
                                                - 2))
                                        }})</span>
                                    </div>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column align="right" min-width="120">
                            <template #header>
                                <el-input v-model="searchcontent" placeholder="搜索" />
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
                <el-card class="box-card mr rounded-xl overflow-auto mt-3" style="height:38%;">
                    <template #header>
                        <div class="card-header">
                            <span class="text-xl font-bold text-gray-700">账户概况</span>
                        </div>
                    </template>
                    <div class="flex justify-center items-center">
                        <div class="flex justify-center items-center px-10 py-5"
                            style="border: 3px solid rgb(104, 185, 251);border-radius: 10px;">
                            <span class="text-xl font-bold">账户余额：</span>
                            <span>{{ user_money }}</span>
                            <img src="../../assets/goldCoin.png" class="w-15 h-15" />
                        </div>
                        <el-button type="primary" icon="Coin" @click="ondel" class="w-30 h-10 ml-10" :loading="loadingright"
                            style="display:block;">提现</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog v-model="dialogFormVisible" title="钱包提现" :width="400">
            <el-form :model="form">
                <el-form-item label="提现金额：" class="text-xl font-bold">
                    <el-input-number v-model="form.num" :min="0" :max="user_money" :controls="false" size="default" />
                </el-form-item>
                <div class="text-gray-500">
                    <span class="text-md font-bold">(账户余额：</span>
                    <span>{{ user_money }})</span>
                </div>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="ondeltrade" :loading="loadingdel">
                        提现
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { addmoney, getmoney, ownstock, delmoney } from '~/api/user.js'
import { search } from '~/api/data.js'
import trade from '~/components/trade.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const tableData = ref([])
const money_choice = ref(0)
const money = ref(100)
const num = ref([500, 1000, 5000, 10000])
const loadingleft = ref(false)
const loadingright = ref(false)
const searchcontent = ref('')
const user_money = ref(1000)
const dialogFormVisible = ref(false)
const loadingdel = ref(false)
const tradedialog = ref(null)
const choice = ref({
    name: '',
    price: 0,
    id: '',
})
const form = ref({
    num: 0,
})
//获取伪随机数
function generateRandomNumberFromDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // 将年、月、日组合成一个字符串
    const dateString = `${year}${month}${day}`;
    // 将字符串转换为数字，并取模一个较大的数值范围，如1000
    const randomNumber = parseInt(dateString) % 1000;
    return randomNumber;
}
const random = ref(generateRandomNumberFromDate() / 1000)
//界面刷新
function update() {
    //初始化表格获取持仓股票
    ownstock().then(res => {
        tableData.value = res.stock
        //删除持有量为0的
        for (let i = 0; i < tableData.value.length; i++) {
            if (tableData.value[i].value == 0) {
                tableData.value.splice(i, 1)
                i--
            }
        }
        //获取价格
        for (let a of tableData.value) {
            search(a.name).then((res) => {
                a.price = res.data[0].value
            })
        }
    })
    //获取账户余额
    getmoney().then(res => {
        user_money.value = res.yue
    })
}
update()
const up = () => {
    update()
}
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
            //充值
            addmoney(res).then(res => {
                ElMessage({
                    message: '充值成功，请前往配置资产',
                    type: 'success',
                })
                update()
            })
        }).finally(() => {
            loadingleft.value = false
        })
}
//提现对话框的显示
const ondel = () => {
    loadingright.value = true
    dialogFormVisible.value = true
    loadingright.value = false
}
//处理提现请求
const ondeltrade = () => {
    loadingdel.value = true
    ElMessageBox.confirm(
        '此操作将提现' + form.value.num + '元, 是否继续?',
        '注意',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            //提现
            dialogFormVisible.value = false
            delmoney(form.value.num).then(res => {
                ElMessage({
                    message: '提现成功，注意查收！',
                    type: 'success',
                })
                update()
            })
        })
        .finally(() => {
            loadingdel.value = false
        })
}

const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !searchcontent.value ||
            data.name.toLowerCase().includes(searchcontent.value.toLowerCase())
    )
)
//交易
const onbuy = (row) => {
    choice.value = row
    tradedialog.value.buy()
    update()
}
const onsell = (row) => {
    choice.value = row
    tradedialog.value.sell()
    update()
}

</script>
<style>
.select {
    @apply h-18 w-40 m-5 rounded-xl;
}</style>