import axios from "~/axios";
//TODO接受预测结果的数据格式
export function getfuture(data) {
    // return axios.post("/api/ai/getfuture",{
    //     name:data.name,
    //     date:data.time,
    // });
    return [[[
        "name",
        "date",
        "price",
    ]], [[
        "qwe",
        "2021-05-01",
        33.3,
    ], [
        "qwe",
        "2021-05-02",
        34.3,
    ], [
        "qwe",
        "2021-05-03",
        35.3,
    ], [
        "qwe",
        "2021-05-04",
        36.3,
    ], [
        "qwe",
        "2021-05-05",
        37.3,
    ], [
        "qwe",
        "2021-05-06",
        38.3,
    ], [
        "qwe",
        "2021-05-07",
        39.3,
    ]], [[
        "asd",
        "2021-05-01",
        34.8,
    ], [
        "asd",
        "2021-05-02",
        36.7,
    ], [
        "asd",
        "2021-05-03",
        38.6,
    ], [
        "asd",
        "2021-05-04",
        40.5,
    ], [
        "asd",
        "2021-05-05",
        23.9,
    ], [
        "asd",
        "2021-05-06",
        24.8,
    ], [
        "asd",
        "2021-05-07",
        25.7,
    ]]]
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