import axios from "~/axios";
export function getfuture(form) {
    return axios.post("/api/api/ai/getfuture",{
        code:form.code.substring(3, form.code.length),
        time:form.time,
    });
}

//获取推荐的股票
export function getrecommend() {
    return axios.get("/api/api/ai/getrecommend");
    // return [{
    //     name: '阿里巴巴',
    //     price: 100,
    //     id: '123',
    //     changeprice: 3.1,
    //     changerate: 1,
    //     detail: [{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     },{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     }]
    // },{
    //     name: '阿里巴巴',
    //     price: 100,
    //     id: '123',
    //     changeprice: 3.1,
    //     changerate: 1,
    //     detail: [{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     },{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     }]
    // },{
    //     name: '阿里巴巴',
    //     price: 100,
    //     id: '123',
    //     changeprice: 3.1,
    //     changerate: 1,
    //     detail: [{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     },{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     }]
    // },{
    //     name: '阿里巴巴',
    //     price: 100,
    //     id: '123',
    //     changeprice: 3.1,
    //     changerate: 1,
    //     detail: [{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     },{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     }]
    // },{
    //     name: '阿里巴巴',
    //     price: 100,
    //     id: '123',
    //     changeprice: 3.1,
    //     changerate: 1,
    //     detail: [{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     },{
    //         name: 'asd',
    //         value: 123,
    //         max:142
    //     },{
    //         name:'qwe',
    //         value: 123,
    //         max:234
    //     },{
    //         name:'zxc',
    //         value: 123,
    //         max:234
    //     }]
    // }]
}
export function testStock() {
    return axios.post("/api/api/ai/testStock");
    
}