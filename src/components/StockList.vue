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
    <el-table :data="tableData" stripe style="width: 100%;height:92%" v-loading="loading">
        <el-table-column fixed prop="name" label="名称" sortable />
        <el-table-column prop="value" label="价格" sortable />
        <el-table-column prop="rate" label="涨跌" sortable>
            <template #default="{ row }">
                <span :style="{ color: row.rate > 0 ? 'red' : 'green' }">{{ row.rate }}%</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
            <template #default="{ row }">
                <div class="flex justify-center items-center">
                    <el-button link v-if="choiceName.indexOf(row.name) == -1" type="primary" size="small"
                        @click="onadd(row)">添加</el-button>
                    <el-popconfirm v-else title="确认删除?" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="ondel(row)">
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
import * as util from '~/composables/util'
const activeName = ref(0)
const input = ref('')
const tableData = ref([])
const choiceData = ref([])
const choiceName = ref([])
const loading = ref(false)
const props = defineProps({
    label: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['detail'])
//发出被选中的信息
const ondetail = (row) => {
    //emit('detail', row, '111')
    loading.value = true
    search(row.name).then((res) => {
        emit('detail', row, res.data[0].code)
    }).finally(() => {
        loading.value = false
    })
}
//更新表格（选择发生了变化）
watch(() => activeName.value, (newValue) => {
    loading.value = true
    if (newValue == 0) {
        gethot().then(res => {
            tableData.value = res.data
        })
    }
    else if (newValue == 1) {
        tableData.value = choiceData.value
    }
    else if (newValue == 2) {
        tableData.value = []
    }
    loading.value = false
})
//搜索
const onsearch = () => {
    loading.value = true
    search(input.value).then(res => {
        tableData.value = res.data
    }).finally(() => {
        loading.value = false
    })
}
//添加/删除
const onadd = (row) => {
    loading.value = true
    search(row.name).then((res0) => {
        addchoice(row.name, res0.data[0].code).then(res => {
            upchoice()
            if (activeName.value == 1)
                tableData.value = choiceData.value
        }).finally(() => {
            loading.value = false
        })
    })
}
const ondel = (row) => {
    loading.value = true
    search(row.name).then((res) => {
        delchoice(row.name, res.data[0].code).then(res => {
            upchoice()
            if (activeName.value == 1)
                tableData.value = choiceData.value
        }).finally(() => {
            loading.value = false
        })
    })
}
//更新选择名单
const upchoice = () => {
    getchoice().then(res => {
        choiceData.value = res.options
        choiceName.value = []
        //获取当前状态
        for (let a of choiceData.value) {
            choiceName.value.push(a.name)
            if (!a.hasOwnProperty('value')) {
                search(a.name).then((res) => {
                    a.value = res.data[0].value
                    a.rate = res.data[0].rate
                })
            }
        }
        if (activeName.value == 1)
            tableData.value = choiceData.value
    })
}
//初始化
gethot().then(res => {
    tableData.value = res.data
})
upchoice()
</script>