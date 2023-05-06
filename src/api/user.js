import axios from '~/axios'
// 登录验证接口
export function login(username, password){
    return axios.post("/admin/login",{
        username,
        password
    })
}
//用户注册
export function signup(data){
    return axios.post("/admin/signup",{
        username:data.username,
        password:data.password,
        repassword:data.repassword,
        email:data.email,
        sex:data.sex,
        birthday:data.birthday,
        question:[data.q1,data.q2,data.q3,data.q4,data.q5,data.q6,data.q7,data.q8,data.q9,data.q10],
    })
}

// 获取用户信息接口
export function getinfo(){
    return axios.post("/admin/getinfo")
}

//修改密码
export function updatepassword(data){
    return axios.post("/admin/updatepassword",data)
}

//修改个人信息
export function updateinfo(data){
    return axios.post("/admin/updateinfo",{
        username:data.username,
        email:data.email,
        sex:data.sex,
        birthday:data.birthday,
        question:[data.q1,data.q2,data.q3,data.q4,data.q5,data.q6,data.q7,data.q8,data.q9,data.q10],
    })
}

//头像上传
export const uploadImage = "/api/admin/image/upload"
