<template>
    <div class="flex justify-center items-center full-screen-bg relative">
        <div class="flex bg-blue-300 font-bold text-xl h-[60px] fixed top-0 left-0 right-0 items-center z-index"
            style="z-index:1000;">
            <!-- logo -->
            <span style="display: flex;" class="w-[180px] flex justify-end items-center">
                <img src="../assets/logo.png" alt="Logo" class="h-12 w-39 cursor-pointer" @click="onback">
            </span>
        </div>
        <!-- 顶部内容 -->
        <el-card class="box-card rounded-4xl relative" shadow="always" style="width: 45%;height: 55%;">
            <el-steps :active="step" finish-status="success" style="width:90%;margin: 0 auto;" simple class="rounded-xl">
                <el-step title="验证邮箱" icon="Message" />
                <el-step title="修改密码" icon="Edit" />
                <el-step title="完成" icon="Select" />
            </el-steps>
            <!-- 表单 -->
            <div class="flex justify-center items-center absolute top-10 bottom-10 left-10 right-10">
                <el-form v-if="step == 0" :model="form1" :rules="rules1" ref="formRef1" label-width="80px"
                    style="width:80%;max-width:320px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form1.username" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form1.email" />
                    </el-form-item>
                </el-form>
                <el-form v-if="step == 1" :model="form2" :rules="rules2" ref="formRef2" label-width="80px"
                    style="width:80%;max-width:320px">
                    <el-form-item label="验证码" prop="checknum">
                        <el-input v-model="form2.checknum" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form2.password" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="repassword">
                        <el-input v-model="form2.repassword" />
                    </el-form-item>
                </el-form>
                <div v-if="step === 3" class="flex-container">
                    <div class="flex-item">
                        <el-icon class="text-8xl text-gray-400">
                            <CircleCheck />
                        </el-icon>
                    </div>
                    <div class="flex-item">
                        <div class="text-gray-400">密码修改完成！</div>
                    </div>
                    <div class="flex-item">
                        <div class="text-gray-400">{{ finfishtime }}秒后自动跳转到登录页面</div>
                    </div>
                </div>

            </div>
            <!-- 底部按钮 -->
            <div class="flex justify-between items-center absolute bottom-4 left-20 right-20">
                <el-button type="primary" icon="ArrowLeft" class="w-15" :disabled="left" @click="onleft" />
                <el-button type="primary" icon="ArrowRight" class="w-15" :disabled="right" @click="onright" />
            </div>
        </el-card>
    </div>
</template>
<script setup>
import { time } from 'echarts';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendemail, forgetpassword } from '~/api/user'
import * as util from '~/composables/util'
const finfishtime = ref(3)
const step = ref(0)
const left = ref(true)
const right = ref(false)
const router = useRouter()
//邮箱验证
const form1 = ref({
    email: '',
    username: '',
})
const rules1 = ref({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
})
const formRef1 = ref(null)
//修改密码
const form2 = ref({
    checknum: '',
    password: '',
    repassword: '',
})
const rules2 = ref({
    checknum: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    repassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
    ],
})
const formRef2 = ref(null)
//返回
const onback = () => {
    router.push('/login')
}
//下一步
const onright = () => {
    if (step.value == 0) {//验证邮箱
        formRef1.value.validate((valid) => {
            if (!valid) return
            sendemail(form1.value).then(res => {
                step.value++
                left.value = false
                util.toast("发送成功，请注意查收！")
            }).catch(err => {
                if (err.repeat) {//重复发送的情况
                    step.value++
                    left.value = false
                }
            })
        })
    }
    if (step.value == 1) {//修改密码
        formRef2.value.validate((valid) => {
            if (!valid) return
            forgetpassword(form2.value).then(res => {
                step.value++
                left.value = false
                util.toast("修改密码成功！")
            })
        })
    }
    if (step.value == 2) {//修改成功准备跳转
        right.value = true
        left.value = true
        step.value++
        repeatTimeout(() => {
            finfishtime.value--
        }, 1000, 3);
        setTimeout(() => {
            router.push('/login')
        }, 3000);
    }
}
function repeatTimeout(callback, delay, times) {
    if (times <= 0) {
        return;
    }
    setTimeout(() => {
        callback();
        repeatTimeout(callback, delay, times - 1);
    }, delay);
}
//上一步
const onleft = () => {
    step.value--
    right.value = false
    if (step.value == 0) {
        left.value = true
    }
}
</script>
<style>
.full-screen-bg {
    position: relative;
    width: 100vw;
    height: 100vh;
}

.full-screen-bg::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -999;
    background-image: url('../assets/forget.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(5px);
    /* 调整模糊程度，单位为像素 */
}

.flex-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.flex-item {
    margin: 10px 0;
}
</style>