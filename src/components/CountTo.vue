<template>
    {{ d.num.toFixed(2) }}
</template>
<script setup>
import gsap from 'gsap'
import { reactive, watch } from 'vue'
const props=defineProps({
    num: {
        type: Number,
        default: 0
    }
})
const d = reactive({
    num:0
})
function AnimateToValue(){
    gsap.to(d, { duration: 1.2, num: props.num })//将d逐渐变成传入的value
}

AnimateToValue()
//如果目标值发生了变化就重新执行动画
watch(()=>props.num,()=>{
    AnimateToValue()
})
</script>