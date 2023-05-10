<template>
    <div v-if="num >= 0" class="flex  justify-center items-center rounded-2xl bg-red-500">
        <trending-up theme="outline" size="48" fill="#ffffff" />
    </div>
    <div v-else class="flex  justify-center items-center rounded-2xl bg-green-500">
        <trending-down theme="outline" size="48" fill="#ffffff" />
    </div>
</template>
<script setup>
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
import { ref, watch } from 'vue'
import { TrendingUp, TrendingDown } from '@icon-park/vue-next';
const num = ref(props.value)
watch(() => props.value, (newValue) => {
  num.value = newValue
})
</script>