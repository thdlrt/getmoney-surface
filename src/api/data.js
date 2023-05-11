import axios from '~/axios'
// 获取新闻列表
const key1 = "022856a900e4d201e1d865f086686383"
const key2 = "1718d2b1c85886ace9c8374a65a5aa12"
export function getnews(page){
    return axios.get("/news/index",{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        params: {
            key: key2,
            page: page,
            page_size: 15,
            type: "caijing",
            is_filter: 1
        },
    })
}
//获取新闻详细信息
export function getcontent(id){
    return axios.get("/news/content",{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        params: {
        uniquekey:id,
        key:key2,
        }
    })
}