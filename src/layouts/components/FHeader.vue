<template>
    <div class="flex bg-blue-300 text-blue-600 font-bold text-xl h-[60px] fixed top-0 left-0 right-0 items-center z-index" style="z-index:1000;">
        <!-- logo -->
        <span style="display: flex;" class="w-[180px] flex justify-end items-center">
            <img src="../../assets/logo.png" alt="Logo" class="h-12 w-39 cursor-pointer" @click="onback">
        </span>
        <!-- 折叠 -->
        <el-tooltip effect="dark" content="折叠" placement="bottom">
            <el-icon class="ion-btn" @click="$store.commit('handleAsideWidth')">
                <fold v-if="$store.state.asideWidth == '240px'" />
                <Expand v-else />
            </el-icon>
        </el-tooltip>
        <!-- 用户信息/下拉菜单等 -->
        <div class="ml-auto flex items-center">
            <el-avatar :size="35" :src="$store.state.user.avatar" />
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="userinfo">个人信息</el-dropdown-item>
                        <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <!-- 抽屉修改密码表单 -->
    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input type="password" v-model="form.oldpassword" placeholder="请输入旧密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请再次输入密码" show-password>
                </el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
    <!-- 个人信息查看\修改 -->
    <form-drawer ref="formDrawerRef2" title="个人信息" destroyOnClose @submit="onSubmit2">
        <el-form :model="form2" :rules="rules2" ref="formRef2" label-width="90px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form2.username" />
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
            <!-- 头像上传 -->
            <span>上传头像</span>
            <el-upload drag :action="uploadImage" :headers="{ token }" name="img" :on-success="uploadSuccess"
                :on-error="uploadError" :data="data"
                accept="image/png, image/jpeg,  image/jpg"
                >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    拖拽文件或<em>点击选择文件</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        仅限jpg/png文件 大小不超过2mb
                    </div>
                </template>
            </el-upload>
            <!-- 选择重新进行评估 -->
            <el-divider />
            <el-form-item v-if="hidequestion">
                <el-button type="warning" @click="showquestion">重新进行风险评估</el-button>
            </el-form-item>
            <!-- 重新进行测试 -->
            <div v-else>
                <el-form-item>
                    <el-button type="danger" @click="showquestion">取消评估</el-button>
                </el-form-item>
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
            </div>
        </el-form>
    </form-drawer>
</template>
<script setup>
//上传头像附带属性
let data = {
    "image_class_id": 168,
}
import * as auth from '~/composables/auth'
import * as util from '~/composables/util'
import { updatepassword, updateinfo, uploadImage } from '~/api/user'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ref, reactive } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
const token = auth.getToken()
const store = useStore()
const router = useRouter()
//退出登录
function userlogout() {
    util.showModal("确定退出登录？").then(res => {
        //清除cookie\vuex
        store.dispatch("logout")
        //跳转
        router.push("/login")
        util.toast("退出成功")
    })
}
//下拉菜单事件监听以及处理
const handleCommand = (command) => {
    switch (command) {
        case "userinfo":
            formDrawerRef2.value.open()
            break;
        case "logout":
            userlogout()
            break;
        case "editPassword":
            formDrawerRef.value.open()
            break;
    }
}
//抽屉-修改密码
const formRef = ref(null)
const formDrawerRef = ref(null)
const form = reactive({
    oldpassword: '',
    password: '',
    repassword: '',
})
const rules = {
    oldpassword: [
        { required: true, message: '旧密码不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
    ],
    repassword: [
        { required: true, message: '请重新输入密码', trigger: 'blur' },
    ]
}
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            //防止重复点击
            formDrawerRef.value.showLoading()
            updatepassword(form).then(res => {
                util.toast("修改成功,请重新登录")
                formDrawerRef.value.close()
                store.dispatch("logout")
                //跳转
                router.push("/login")
            }).finally(res => {
                formDrawerRef.value.hideLoading()
            })
        } else {
            return false
        }
    })
}
//个人信息查看/修改
const formRef2 = ref(null)
const formDrawerRef2 = ref(null)
const form2 = reactive({
    username: store.state.user.username,
    sex: '',//store.state.user.sex
    email: '',//store.state.user.email
    birthday: '',//store.state.user.birthday
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
const rules2_1 = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    birthday: [
        { required: true, message: '请选择生日', trigger: 'blur' },
    ],
}
const rules2_2 = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    birthday: [
        { required: true, message: '请选择生日', trigger: 'blur' },
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
const rules2 = ref(rules2_1)
const onSubmit2 = () => {
    formRef2.value.validate((valid) => {
        if (valid) {
            //防止重复点击
            formDrawerRef2.value.showLoading()
            updateinfo(form2).then(res => {//注册成功返回登陆
                util.toast('修改成功');
                formDrawerRef2.value.hideLoading()
                window.location.reload();
            }).catch(err => {//校验不通过,需要修改
                formDrawerRef2.value.hideLoading()
            })
        } else {
            return false
        }
    })
}
//头像上传
const uploadSuccess = (response, uplloadFile, uploadFiles) => {
    console.log("success")
}
const uploadError = (error, uplloadFile, uploadFiles) => {
    let msg = JSON.parse(error.message).msg || '上传失败'
    util.toast(msg, "error")
}
//重新进行调查
let hidequestion = true;
const showquestion = () => {
    hidequestion^=1;
    if(hidequestion)
        rules2.value = rules2_1;
    else
    rules2.value = rules2_2;
    formRef2.value.$forceUpdate();
}
//返回
const onback = () => {
    router.push('/login')
}
</script>
<style>
/* 按钮样式 */
.ion-btn {
    @apply flex justify-center items-center w-[42px] h-[64px];
    cursor: pointer;

}

.ion-btn:hover {
    @apply bg-blue-200;
}

/* 下拉菜单 */
.dropdown {
    @apply flex justify-center items-center mx-5;
    height: 64px;
    cursor: pointer;
}
</style>