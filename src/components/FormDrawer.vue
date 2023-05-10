<template>
    <el-drawer v-model="showDrawer" :title="title" :size="size" :destroy-on-close="destroyOnClose" :before-close="handleClose">
        <div class="formDrawer">
            <!-- 表单 -->
            <div class="body">
                <slot></slot>
            </div>
            <!-- 按钮 -->
            <div class="actions">
                <el-button :round="true" type="primary" @click="submit"  class="bg-blue-400 w-[120px]" :loading="loading">{{ confirmText }}</el-button>
                <el-button :round="true" @click="onCancel" class="w-[118px]" :loading="loading">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script setup>
    import { ref } from 'vue'
    import { ElMessageBox } from 'element-plus'
    const showDrawer = ref(false)
    const loading =ref(false)
    const showLoading = () => {
        loading.value = true
    }
    const hideLoading = () => {
        loading.value = false
    }
    const open = () => {
        showDrawer.value = true
    }
    const close = () => {
        showDrawer.value = false
    }
    //导出方法
    defineExpose({
        open,
        close,
        showLoading,
        hideLoading,
    })
    //props
    const props = defineProps({
        title:String,
        size:{
            type:String,
            default:"45%"
        },
        destroyOnClose:{
            type:Boolean,
            default:false
        },
        confirmText:{
            type:String,
            default:"确定"
        },
    })
    //取消
    const onCancel = () => {
        close()
    }
    //确定,发送submit信号
    const emit = defineEmits(["submit"])
    const submit = () => {
        emit("submit")
    }
    const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭？', '注意',{
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    })
    .then(() => {
      done()
    })
    .catch(() => {
    })
}
</script>
<style>
    .formDrawer {
        width: 100%;
        height: 100%;
        position: relative;
        @apply flex;
    }
    .formDrawer .body{
        flex: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        overflow-y: auto;
    }
    .formDrawer .actions{
        height:50px;
        width: 100%;
        height: 100%;
        @apply flex items-end justify-center;
    }
</style>