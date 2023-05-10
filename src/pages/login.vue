<template>
    <!-- 左侧图示 -->
    <el-row class="min-h-screen bg-blue-400 relative">
        <el-col :lg="16" :md="12" class="leftcol">
            <video autoplay loop muted class="absolute h-full w-full object-cover z-0">
                <source src="../assets/background.mp4" type="video/mp4">
            </video>
            <div>
                <img src="../assets/logo.png" alt="Logo" class="absolute left-5 top-5 h-16 w-56">
            </div>
            <div style="position: relative; z-index: 1;">
                <div class="font-bold text-8xl text-light-50 mb-4">Welcome</div>
                <div class="font-bold text-7xl text-light-50 mb-4">Back!</div>
                <div class="text-3xl text-gray-200">FinGenius在线量化投资交易平台</div>
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
                    <el-button :round="true" type="primary" @click="onSubmit" class="w-[120px] bg-blue-400"
                        :loading="loading">登录</el-button>
                    <el-button :round="true" @click="onSubmit_sign" class="w-[118px]">注册</el-button>
                </el-form-item>
                <div class="flex justify-center">
                    <el-button text type='primary' @click="onSubmit_forget">找回密码</el-button>
                </div>
            </el-form>
        </el-col>
    </el-row>
    <!-- 注册表单抽屉 -->
    <form-drawer ref="formDrawerRef" title="注册" destroyOnClose @submit="onSubmit2">
        <el-form :model="form2" :rules="rules2" ref="formRef2" label-width="90px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form2.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form2.password" type="password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="form2.repassword" type="password" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form2.email" />
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
                <el-date-picker v-model="form2.birthday" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="form2.sex">
                    <el-radio label="男" />
                    <el-radio label="女" />
                </el-radio-group>
            </el-form-item>
            <!-- 调查 -->
            <el-divider />
            <el-form-item label="1、" prop="q1">
                您目前的个人及家庭财务状况属于以下哪一种：
                <el-radio-group v-model="form2.q1">
                    <el-radio label="A、有较大数额未到期负债" />
                    <el-radio label="B、收入和支出相抵" />
                    <el-radio label="C、有一定积蓄" />
                    <el-radio label="D、有较为丰厚的积蓄并有一定的投资" />
                    <el-radio label="E、比较富裕且有相当的投资" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="2、" prop="q2">
                您个人目前已经或者准备投资的基金金额占您或者家庭所拥有总资产的比重是多少：（备注：总资产包括存款、证券投资、房地产及实业等）
                <el-radio-group v-model="form2.q2">
                    <el-radio label="A、80-100%" />
                    <el-radio label="B、50-80%" />
                    <el-radio label="C、20-50%" />
                    <el-radio label="D、10-20%" />
                    <el-radio label="E、0-10%" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="3、" prop="q3">
                您的年收入是多少：
                <el-radio-group v-model="form2.q3">
                    <el-radio label="A、20 万元以下" />
                    <el-radio label="B、20 万元至50 万元" />
                    <el-radio label="C、50万元至150 万元" />
                    <el-radio label="D、150 万元至500 万元" />
                    <el-radio label="E、500 万元以上" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="4、" prop="q4">
                您的投资经验可描述为：
                <el-radio-group v-model="form2.q4">
                    <el-radio label="A、除银行储蓄外，基本没有其他投资经验" />
                    <el-radio label="B、购买过银行理财产品" />
                    <el-radio label="C、购买过债券、保险等理财产品" />
                    <el-radio label="D、参与过股票、基金等产品的交易" />
                    <el-radio label="E、参与过权证、期货、期权等产品的交易" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="5、" prop="q5">
                您是否有过基金专户、券商理财计划、信托计划等产品的投资经历，如有投资时间是多长：
                <el-radio-group v-model="form2.q5">
                    <el-radio label="A、没有" />
                    <el-radio label="B、有，但是少于1 年" />
                    <el-radio label="C、有，在1－3 年之间" />
                    <el-radio label="D、有，在3－5 年之间" />
                    <el-radio label="E、有，长于5 年" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="6、" prop="q6">
                您计划中的投资期限是多长：
                <el-radio-group v-model="form2.q6">
                    <el-radio label="A、少于1年" />
                    <el-radio label="B、1-2年" />
                    <el-radio label="C、2-3 年" />
                    <el-radio label="D、3-5 年" />
                    <el-radio label="E、5 年以上" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="7、" prop="q7">
                您投资基金专户、券商理财计划、信托计划等产品主要用于什么目的：
                <el-radio-group v-model="form2.q7">
                    <el-radio label="A、平时生活保障，赚点补贴家用" />
                    <el-radio label="B、养老" />
                    <el-radio label="C、子女教育" />
                    <el-radio label="D、资产增值" />
                    <el-radio label="E、家庭富裕" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="8、" prop="q8">
                以下哪项描述最符合您的投资态度：
                <el-radio-group v-model="form2.q8">
                    <el-radio label="A、厌恶风险，不希望本金损失，希望获得稳定回报" />
                    <el-radio label="B、保守投资，不希望本金损失，愿意承担一定幅度的收益波动" />
                    <el-radio label="C、寻求一定的资金收益和成长性，在深思熟虑后愿意承担一定的风险" />
                    <el-radio label="D、寻求资金的较高收益和成长性，愿意为此承担有限本金损失" />
                    <el-radio label="E、希望赚取高回报，愿意为此承担较大本金损失" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="9、" prop="q9">
                以下几种投资模式，您更偏好哪种模式：
                <el-radio-group v-model="form2.q9">
                    <el-radio label="A、收益只有5%，但不亏损" />
                    <el-radio label="B、收益15%，但可能亏损5%" />
                    <el-radio label="C、收益是30%，但可能亏损15%" />
                    <el-radio label="D、收益50%，但可能亏损30%" />
                    <el-radio label="E、收益100%，但可能亏损60%" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="10、" prop="q10">
                您认为自己能承受的最大投资损失是多少：
                <el-radio-group v-model="form2.q10">
                    <el-radio label="A、10%以内" />
                    <el-radio label="B、10%－20%" />
                    <el-radio label="C、20%－30%" />
                    <el-radio label="D、30%－50%" />
                    <el-radio label="E、超过50%" />
                </el-radio-group>
            </el-form-item>
        </el-form>
    </form-drawer>
    <!-- 忘记密码抽屉 -->
    <form-drawer ref="formDrawerRef3" title="找回密码" destroyOnClose @submit="onSubmit3">
        <el-form :model="form3" :rules="rules3" ref="formRef3" label-width="90px">

        </el-form>
    </form-drawer>
</template> 
<style scoped>
.logo {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
}

.leftcol {
    position: relative;
    overflow: hidden;
    @apply flex items-center justify-center;
}
</style>
<script setup>
import { ref, reactive } from 'vue'
import { login, signup } from '../api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as auth from '~/composables/auth'
import * as util from '~/composables/util'
import FormDrawer from '~/components/FormDrawer.vue'

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
                    router.push("/data/main")
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
    formDrawerRef.value.open()
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
// 注册表单抽屉
const formRef2 = ref(null)
const formDrawerRef = ref(null)
const form2 = reactive({
    username: '',
    password: '',
    repassword: '',
    sex: '',
    email: '',
    birthday: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
})
const rules2 = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
    ],
    repassword: [
        { required: true, message: '请重新输入密码', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    birthday: [
        { required: true, message: '请选择生日', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'blur' },
    ],
    q1: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q2: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q3: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q4: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q5: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q6: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q7: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q8: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q9: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
    q10: [
        { required: true, message: '请选择答案', trigger: 'blur' },
    ],
}
const onSubmit2 = () => {
    formRef2.value.validate((valid) => {
        if (valid) {
            //防止重复点击
            formDrawerRef.value.showLoading()
            signup(form2).then(res => {//注册成功返回登陆
                util.toast('注册成功,请返回登录');
                formDrawerRef.value.hideLoading()
            }).catch(err => {//校验不通过,需要修改
                formDrawerRef.value.hideLoading()
            })
        } else {
            return false
        }
    })
}
//忘记密码
const formRef3 = ref(null)
const formDrawerRef3 = ref(null)
const onSubmit_forget = () => {
    formDrawerRef3.value.open()
}
const form3 = reactive({
    username: '',

})
const rules3 = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],

}
const onSubmit3 = () => {
    formRef2.value.validate((valid) => {
        if (valid) {
            //防止重复点击
            formDrawerRef.value.showLoading()
            signup(form2).then(res => {//注册成功返回登陆
                util.toast('注册成功,请返回登录');
                formDrawerRef.value.hideLoading()
            }).catch(err => {//校验不通过,需要修改
                formDrawerRef.value.hideLoading()
            })
        } else {
            return false
        }
    })
}
</script>