<template>
    <!-- 左侧图示 -->
    <el-row class="min-h-screen bg-blue-400 relative">
        <el-col :lg="16" :md="12" class="flex items-center justify-center">
            <div>
                <img src="../assets/logo.png" alt="Logo" class="absolute left-5 top-5 h-16 w-56">
            </div>
            <div>
                <div class="font-bold text-6xl text-light-50 mb-4">欢迎光临</div>
                <div class="text-2xl text-gray-200">FinGenius在线量化投资交易平台</div>
            </div>
        </el-col>
        <!-- 右侧登录 -->
        <el-col :lg="8" :md="12" class="bg-light-50 flex items-center justify-center flex-col">
            <h2 class="font-bold text-3xl text-gray-800">欢迎回来</h2>
            <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
                <span class="h-[1px] w-16 bg-gray-200"></span>
                <span>账号密码登录</span>
                <span class="h-[1px] w-16 bg-gray-200"></span>
            </div>
            <!-- 表单 -->
            <!-- 输入 -->
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
                <!-- 按钮 -->
                <el-form-item>
                    <el-button :round="true" type="primary" @click="onSubmit" class="w-[120px] bg-blue-400" :loading="loading">登录</el-button>
                    <el-button :round="true" @click="onSubmit_sign" class="w-[118px]" >注册</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template> 
<style scoped>
.logo {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
}
</style>
<script setup>
import { ref, reactive } from 'vue'
import { login, getinfo } from '../api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as auth from '~/composables/auth'
import * as util from '~/composables/util'

const form = reactive({
    username: '',
    password: '',
})

const formRef = ref(null)
const loading = ref(false)
const router = useRouter()
const store = useStore()
// 提交判断
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            //防止重复点击
            loading.value = true
            login(form.username, form.password)  
                .then(res => {
                    util.toast('登录成功');
                    //保存cookie
                    auth.setToken(res.token)
                    router.push("/")
                }).finally(() => {
                    //复位
                    loading.value = false
                })
        } else {
            return false
        }
    })
}
//注册跳转
const onSubmit_sign = () => {
    router.push("/signup")
}
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