<template>
    <el-table :data="data" style="width: 100%"  height="400">
    <el-table-column label="交易时间" prop="date" sortable/>
    <el-table-column label="股票名称" prop="name" sortable/>
    <el-table-column label="交易单价" prop="price" sortable/>
    <el-table-column label="交易数目" prop="value" sortable/>
    <el-table-column label="交易金额" prop="money" sortable/>
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
</style>