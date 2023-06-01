<template>
    <el-card class="box-card rounded-2xl" shadow="always" style="height:100%;position: relative;">
        <el-row :gutter="10" style="position:absolute;top:10px;bottom:10px;left:10px;right:10px;">
            <!-- 左侧表单 -->
            <el-col :lg="10" :md="12" :sm="12" :offset="0" class="overflow-y-auto overflow-x-hidden" style="height:100%;">
                <el-form :model="form" class="w-[250px]" :rules="rules" ref="formRef">
                    <el-form-item prop="name">
                        <el-input v-model="form.username" placeholder="请输入用户名">
                            <template #prefix>
                                <el-icon>
                                    <user />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="passwd">
                        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
                            <template #prefix>
                                <el-icon>
                                    <lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="checknum">
                        <el-input type="text" v-model="form.checknum" placeholder="请输入图形验证码" />
                        <CheckNum ref="checknum" />
                    </el-form-item>
                    <el-form-item>
                        <el-button :round="true" type="primary" @click="onSubmit" class="w-[120px] bg-blue-400"
                            :loading="loading">登录</el-button>
                        <el-button :round="true" @click="onSubmit_sign" class="w-[118px]">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!-- 右侧图表 -->
            <el-col :lg="14" :md="12" :sm="12" :offset="0" class="overflow-y-auto overflow-x-hidden bg-pink-200"
                style="height:100%;">

            </el-col>
        </el-row>
    </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
const formRef = ref(null)
const loading = ref(false)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            //防止重复点击
            loading.value = true
            // login(form.username, form.password)
            //     .then(res => {
            //         util.toast('登录成功');
            //         //保存cookie
            //         auth.setToken(res.token)
            //         router.push("/data/main")
            //     }).catch((err)=>{
            //         checknum.value.reload()
            //         form.checknum = ''
            //     }).finally(() => {
            //         //复位
            //         loading.value = false
            //     })
        } else {
            return false
        }
    })
}
const form = reactive({
    username: '',
    password: '',
    checknum: '',
})
// 表单验证
const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        // { min: 3, max: 15, message: '用户名长度必须在 3 到 15 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        // { min: 6, max: 10, message: '密码长度必须在 6 到 20 个字符', trigger: 'blur' }
    ]
}
</script>