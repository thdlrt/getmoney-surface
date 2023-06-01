<template>
    <!-- 买入卖出消息提示框 -->
    <el-dialog v-model="dialogFormVisible" title="确认交易">
        <el-descriptions :border="true">
            <el-descriptions-item label="股票名称：">{{ dialogInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="股票价格：">{{ dialogInfo.price }}</el-descriptions-item>
            <el-descriptions-item label="交易总额：">{{ dialogInfo.price * tradenum }}</el-descriptions-item>
        </el-descriptions>
        <div class="mt-5 text-md ml-5">
            <div>
                <span>{{ dialogInfo.title }}股票数目:</span>
                <el-input-number v-model="tradenum" :min="100" :max="10000" :step="100" size="middle"
                    controls-position="right" class="ml-8 w-50" />
            </div>
            <div class="flex items-center">
                <div class="mt-4 flex">
                    <div>图形验证码:</div>
                    <el-input v-model="checkinput" placeholder="请输入验证码" class="ml-5 w-50" />
                </div>
                <CheckNum ref="checknum" />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="danger" @click="dialogFormVisible = false">取消</el-button>
                <el-popconfirm title="确定要进行交易?" confirm-button-text="确认" cancel-button-text="取消" @confirm="confirmEvent">
                    <template #reference>
                        <el-button type="primary">
                            买入
                        </el-button>
                    </template>
                </el-popconfirm>
            </span>
        </template>
    </el-dialog>
</template>  
<script setup>
import { ref } from 'vue'
import { buyStock, sellStock } from '~/api/user.js'
import * as util from '~/composables/util'
import CheckNum from './CheckNum.vue';
const dialogFormVisible = ref(false)
const dialogInfo = ref(null)
const tradenum = ref(100)
const checknum = ref(null)
const checkinput = ref('')
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
    }
})
dialogInfo.value = {
    name: props.name,
    price: props.price,
    id: props.id,
}
//买入/卖出股票
const buy = () => {
    dialogInfo.value = props
    dialogFormVisible.value = true
    dialogInfo.title = "买入"

}
const sell = () => {
    dialogInfo.value = props
    dialogFormVisible.value = true
    dialogInfo.title = "卖出"
}
//确认交易
const confirmEvent = () => {
    //检查验证码
    if(!checknum.value.checkinput(checkinput.value)){
        checknum.value.reload()
        util.toast('验证码错误!','error')
        checkinput.value = ''
        return
    }
    if (dialogInfo.value.title == "买入") {
        buyStock(dialogInfo.value.id, tradenum.value).then(res => {
            dialogFormVisible.value = false
            util.toast('交易成功!')
        })
    }
    else {
        sellStock(dialogInfo.value.id, tradenum.value).then(res => {
            dialogFormVisible.value = false
            util.toast('交易成功!')
        })
    }
}
defineExpose({
    buy,
    sell,
})
</script>  