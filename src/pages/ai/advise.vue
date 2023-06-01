<template>
    <div class="flex">
        <adviseStock v-for="(item, index) in recommend" :key="index" :name="item.name" :price="item.price"
            :id="item.id" :changerate="item.changerate" :changeprice="item.changeprice" :detail="item.detail" :index="index"/>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import adviseStock from '~/components/adviseStock.vue'
import { getrecommend } from '~/api/ai.js'
const recommend = ref([])
// getrecommend().then(res => {
//     recommend.value = res.data
// })
recommend.value = getrecommend()
</script>