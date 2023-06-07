<template>
    <el-alert title="注意" description="本网站推荐的股票是根据机器学习算法对股票进行多指标评估与预测而生成，并不能保证一定盈利" type="warning" show-icon />
    <div class="flex flex-wrap">
        <adviseStock v-for="(item, index) in recommend" :key="index" :name="item.name" :price="item.price" :id="item.id"
            :changerate="item.changerate" :changeprice="item.changeprice" :detail="item.detail" :index="index" />
    </div>
</template>
<script setup>
import { ref } from 'vue'
import adviseStock from '~/components/adviseStock.vue'
import { getrecommend } from '~/api/ai.js'
import { search } from '~/api/data.js'
const recommend = ref([])
getrecommend().then(res => {
    let temp = res
    let max_data = temp["各项最大值"]
    delete temp["各项最大值"]
    let data = {}
    for (let a in temp) {
        data[a] = {
            id: a,
            name: '',
            price: 0,
            changerate: 0,
            changeprice: 0,
            detail: []
        }
        for (let b in temp[a]) {
            data[a].detail.push({
                name: b,
                value: temp[a][b],
                max: max_data[b],
            })
        }
        search(a).then((res) => {
            data[res.data[0].code.substring(3, 9)].name = res.data[0].name
            data[res.data[0].code.substring(3, 9)].price = res.data[0].value
            data[res.data[0].code.substring(3, 9)].changerate = res.data[0].rate
            data[res.data[0].code.substring(3, 9)].changeprice = res.data[0].price - res.data[0].close
            recommend.value.push(data[res.data[0].code.substring(3, 9)])
            console.log(recommend.value)
        })
    }
})
</script>