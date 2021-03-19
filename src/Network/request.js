import axios from 'axios'

export function request(config,method){
    const instance = axios.create({
        method:method
    })

    //前端请求拦截
    instance.interceptors.request.use(config=>{
        return config
    },err=>{
        console.log(err);
    })

    //前端响应拦截
    instance.interceptors.response.use(res=>{
        return res.data
    },err=>{
        console.log(err);
    })

    return instance(config)
}