<template>
    <!-- 选择栏 -->
    <el-tabs v-model="activeName" class="demo-tabs ml-5">
        <el-tab-pane label="热门"></el-tab-pane>
        <el-tab-pane label="自选"></el-tab-pane>
        <el-tab-pane label="搜索">
            <el-row :gutter="0" class="justify-center items-center">
                <el-col :span="18" :offset="0">
                    <el-input v-model="input" class="m-2" placeholder="代码/名称" style="width:90%;">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="6" :offset="0">
                    <el-button type="primary" @click="onsearch">搜索</el-button>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%;height:100%">
        <el-table-column fixed prop="name" label="名称" sortable />
        <el-table-column prop="price" label="价格" sortable />
        <el-table-column prop="rate" label="涨跌" sortable>
            <template #default="{ row }">
                <span :style="{ color: row.rate > 0 ? 'red' : 'green' }">{{ row.rate }}%</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
            <template #default="{ row }">
                <div class="flex justify-center items-center">
                    <el-button link v-if="choiceName.indexOf(row.name) == -1" type="primary" size="small"
                        @click="onadd(row)" :loading="loading_add">添加</el-button>
                    <el-popconfirm v-else title="确认删除?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="ondel(row)" :loading="loading_del">
                        <template #reference>
                            <el-button link type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button link type="primary" size="small" @click="ondetail(row)">{{ props.label }}</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { ref, watch } from 'vue'
import { gethot, search, getchoice, addchoice, delchoice } from '~/api/data.js'
const activeName = ref(0)
const input = ref('')
const tableData = ref([])
const choiceData = ref([])
const choiceName = ref([])
const loading_add = ref(false)
const loading_del = ref(false)
const props = defineProps({
    label:{
        type:String,
        default:''
    }
})
const emit =defineEmits(['detail'])
//发出被选中的信息
const ondetail = (row) => {
    emit('detail',row)
}
//更新表格（选择发生了变化）
watch(() => activeName.value, (newValue) => {
    if (newValue == 0) {
        // gethot().then(res => {
        //     tableData.value = res.data
        // })
        tableData.value = gethot()
    }
    else if (newValue == 1) {
        tableData.value = choiceData.value
    }
    else if (newValue == 2) {
        tableData.value = []
    }
})
//搜索
const onsearch = () => {
    // search(input.value).then(res => {
    //     tableData.value = res.data
    // })
}
//添加/删除
const onadd = (row) => {
    addchoice(row.name)
    //loading_add.value = true
    // getchoice(row.name).then(res => {
    //         choiceData.value = res.data
    //         upchoice()
    //         if(activeName.value==1)
    //             tableData.value = choiceData.value
    //     }).finally(() => {
    //         loading_add.value = false
    //     })
}
const ondel = (row) => {
    delchoice(row.name)
    //更新显示
    //loading_del.value = true
    // getchoice().then(res => {
    //         choiceData.value = res.data
    //          upchoice()
    //         if(activeName.value==1)
    //             tableData.value = choiceData.value
    //     }).finally(() => {
    //         loading_del.value = false
    //     })
}
//更新选择名单
const upchoice = () => {
    choiceName.value = []
    for (let a of choiceData.value)
        choiceName.value.push(a.name)
}
//初始化
// gethot().then(res => {
//     tableData.value = res.data
// })
tableData.value = gethot()
// getchoice().then(res => {
//     console.log(res.data)
// })
choiceData.value = getchoice()
upchoice()
</script>