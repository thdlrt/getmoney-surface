import axios from '~/axios'
// 登录验证接口
export function login(username, password){
    return axios.post("/admin/login",{
        username,
        password
    })
}
// 获取用户信息接口
export function getinfo(){
    return axios.post("/admin/getinfo")
}
//退出登录
export function logout(){
    return axios.post("/admin/logout")
}
