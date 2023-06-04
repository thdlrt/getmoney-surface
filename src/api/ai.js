import axios from "~/axios";
export function getfuture(data) {
    // return axios.post("/api/ai/getfuture",{
    //     name:data.name,
    //     date:data.time,
    // });
    return [-0.12, -0.16, -0.31, 1, -0.04, -0.13]
}

//获取推荐的股票
export function getrecommend() {
    // return axios.post("/api/ai/getrecommend");
    return [{
        name: '阿里巴巴',
        price: 100,
        id: '123',
        changeprice: 3.1,
        changerate: 1,
        detail: [{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        },{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        }]
    },{
        name: '阿里巴巴',
        price: 100,
        id: '123',
        changeprice: 3.1,
        changerate: 1,
        detail: [{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        },{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        }]
    },{
        name: '阿里巴巴',
        price: 100,
        id: '123',
        changeprice: 3.1,
        changerate: 1,
        detail: [{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        },{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        }]
    },{
        name: '阿里巴巴',
        price: 100,
        id: '123',
        changeprice: 3.1,
        changerate: 1,
        detail: [{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        },{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        }]
    },{
        name: '阿里巴巴',
        price: 100,
        id: '123',
        changeprice: 3.1,
        changerate: 1,
        detail: [{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        },{
            name: 'asd',
            value: 123,
            max:142
        },{
            name:'qwe',
            value: 123,
            max:234
        },{
            name:'zxc',
            value: 123,
            max:234
        }]
    }]
}
export function testStock() {
    return axios.post("/api/ai/testStock");
    
}