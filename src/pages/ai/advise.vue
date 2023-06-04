<template>
    <el-alert title="注意" description="本网站推荐的股票是根据机器学习算法对股票进行多指标评估与预测而生成，并不能保证一定盈利" type="warning" show-icon />
    <div class="flex flex-wrap">
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