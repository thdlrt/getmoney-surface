<template>
    <div class="pt-2">
        <el-image style="width: 160px; height: 50px" :src="url" fit="contain" @click="reload" class="cursor-pointer"/>
    </div>
</template>
<script setup>
    import { ref } from 'vue'
    import { getnum } from '../api/user'
    import * as util from '~/composables/util'
    const url = ref('')
    var checknum
    //获取验证码
    const reload = () => {
        getnum().then(res => {
            url.value = res.verifyCodeImgUrl
            checknum = res.verifyCode.toLowerCase()
        }).catch(err => {
           util.toast("刷新过于频繁，请稍后", "error")
        })
    }
    reload()
    //检查验证码是否正确
    function checkinput(input) {
        if (input.toLowerCase() == checknum) {
            return true
        } else {
            return false
        }
    }
    defineExpose({
        checkinput,
        reload,
    })
</script>