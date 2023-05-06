 import axios from 'axios'
 import * as util from '~/composables/util'
 import * as auth from '~/composables/auth'
 import store from "./store"
 const service = axios.create({
    baseURL: '/api',
 })
 // 添加请求拦截器
 service.interceptors.request.use(function (config) {
   // cookie(token)添加到请求头
   const token = auth.getToken();
   if (token) {
      config.headers["token"] = token;
   }
   return config;
 }, function (error) {
   // 对请求错误做些什么
   return Promise.reject(error);
 });

// 添加响应拦截器
service.interceptors.response.use(function (response) {
   //简化返回数据的格式
   return response.data.data;
 }, function (error) {
   // 错误提示
   const msg = error.response.data.msg || "请求失败"
    
   if(msg == "非法token，请先登录！"){
     store.dispatch("logout").finally(()=>location.reload())
   }

   util.toast(msg,"error")
   return Promise.reject(error);
 });
 export default service