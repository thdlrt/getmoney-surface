<template>
    <el-table :data="data" style="width: 100%"  height="400" :row-class-name="tableRowClassName">
    <el-table-column type="expand">
      <template #default="props">
        <div m="4">
          <el-table :data="props.row.detail" :row-class-name="tableRowClassName">
            <el-table-column label="投资内容" prop="name" />
            <el-table-column label="投资收益" prop="income" />
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="开始时间" prop="begin" sortable/>
    <el-table-column label="结束时间" prop="end" sortable/>
    <el-table-column label="投资金额" prop="value" sortable/>
    <el-table-column label="投资收益" prop="income" sortable/>
  </el-table>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    value: {
        type: Array,
        default: function(v) { return }
    }
})
const data = ref(props.value)
watch(() => props.value, (newValue) => {
  data.value = newValue
})
//颜色设置
const tableRowClassName = ({
  row,
  rowIndex,
}) => {
  if (row.income<0) {
    return 'success-row'
  } 
  else{
    return 'warning-row'
  }
}
</script>
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-error-light-7);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-7);
}
</style>