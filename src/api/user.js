import axios from '~/axios'
// 登录验证接口
export function login(username, password){
    return axios.post("/api/admin/login",{
        username,
        password
    })
}
//找回密码
export function forgetpassword(username, email, data){
    return axios.post("/api/admin/forgetpassword",{
        username:username,
        email:email,
        checknum:data.checknum,
        password:data.password,
        repassword:data.repassword,
    })
}
//发送验证码
export function sendemail(data){
    return axios.get("/api/admin/sendemail",{
        username:data.username,
        email:data.email,
    })
}
//用户注册
export function signup(data){
    return axios.post("/api/admin/signup",{
        username:data.username,
        password:data.password,
        repassword:data.repassword,
        email:data.email,
        sex:data.sex,
        birthday:data.birthday,
        question:[data.q1,data.q2,data.q3,data.q4,data.q5,data.q6,data.q7,data.q8,data.q9,data.q10],
    })
}
//获取验证码
export function getnum(){
    return axios.get("https://www.mxnzp.com/api/verifycode/code?len=5&type=0&app_id=kkmbiknfifjroheo&app_secret=SEtENi8vcDZORjRXSlBPeXBFcTNlQT09",{
        type:'0',
    })
}
// 获取用户信息接口
export function getinfo(){
    return axios.post("/api/admin/getinfo")
}

//修改密码
export function updatepassword(data){
    return axios.post("/api/admin/updatepassword",data)
}

//修改个人信息
export function updateinfo(data){
    return axios.post("/api/admin/updateinfo",{
        username:data.username,
        email:data.email,
        sex:data.sex,
        birthday:data.birthday,
        question:[data.q1,data.q2,data.q3,data.q4,data.q5,data.q6,data.q7,data.q8,data.q9,data.q10],
    })
}

export function gettradeinfo(){
    //return axios.post("/api/admin/gettradeinfo")
    /*
data:{
    week:[{
        income:当日收益
        date:日期
        detail:[{
            name:股票名称
            income:股票收益
        }...]//当日收益详情
    }...最多7天数据],
    acincome:累计收益
    rate:7天年化收益率
    acrate:累计收益率
    transactions:[{
        begin:起始日期
        end:结束日期
        value:交易金额
        detail:[{
            name:股票名称
            income:股票收益
        }...]//不同股票收益详情
        income:交易收益
    }...]//交易记录
    trend[{
        date:日期
        value:资产
    }...]//资产走势
    asset:[{
        name:股票名称
        value:股票价值
    }...]//资产分布
}
    */
    let data={
        week:[{
            income:-0.3,
            date:"2021-01-01",
            detail:[{
                name:"股票1",
                income:-0.4
            },{
                name:"股票2",
                income:0.1
            }],
        },{
            income:0.2,
            date:"2021-01-02",
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
        },{
            income:0.1,
            date:"2021-01-03",
            detail:[{
                name:"股票1",
                income:-0.5
            },{
                name:"股票2",
                income:0.6
            }],
        },{
            income:0.4,
            date:"2021-01-04",
            detail:[{
                name:"股票1",
                income:0.2
            },{
                name:"股票2",
                income:0.2
            }],
        },{
            income:0.3,
            date:"2021-01-05",
            detail:[{
                name:"股票1",
                income:0.2
            },{
                name:"股票2",
                income:0.1
            }],
        },{
            income:0.6,
            date:"2021-01-06",
            detail:[{
                name:"股票1",
                income:0.5
            },{
                name:"股票2",
                income:0.1
            }],
        },{
            income:-0.1,
            date:"2021-01-07",
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:-0.2
            }],
        }],
        acincome:12,
        rate:0.3,
        acrate:0.4,
        transactions:[{
            begin:"2021-01-01",
            end:"2021-01-02",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-02",
            end:"2021-01-03",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:-0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:-0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        },{
            begin:"2021-01-03",
            end:"2021-01-04",
            value:100,
            detail:[{
                name:"股票1",
                income:0.1
            },{
                name:"股票2",
                income:0.1
            }],
            income:0.2
        }],
        trend:[{
            date:"2021-01-01",
            value:100
        },{
            date:"2021-01-02",
            value:200
        },{
            date:"2021-01-03",
            value:180
        },{
            date:"2021-01-04",
            value:300
        }],
        asset:[{
            name:"股票1",
            value:100
        },{
            name:"股票2",
            value:200
        }]
    }
    return data;
}
//钱包充值
export function addmoney(num){
    // return axios.post("/api/admin/addmoney",{
    //     num:num
    // })
    
}
//钱包提现
export function getmoney(num){
    // return axios.post("/api/admin/getmoney",{
    //     num:num
    // })

}
//获取持仓股票
export function ownstock(){
    //return axios.post("/api/admin/ownstock")
    return [{
        name:"股票1",
        price:100,
        num:100,
    },{
        name:"股票2",
        price:200,
        num:200,
    },{
        name:"股票3",
        price:300,
        num:300,
    }]
}
//买入股票
export function buyStock(id,value){
    return axios.post("/api/admin/buyStock",{
        id:id,
        value:value
    })
}
//卖出股票
export function sellStock(id,value){
    return axios.post("/api/admin/sellStock",{
        id:id,
        value:value
    })
}
//头像上传
export const uploadImage = "/api/admin/image/upload"
