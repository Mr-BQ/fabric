import axios from 'axios'

export function request(config,method){
    let baseurl = localStorage.getItem('fabric-base-url')?localStorage.getItem('fabric-base-url'):'http://localhost:8888'

    const instance = axios.create({
        // baseURL:'http://47.115.158.68:8888',
        baseURL:baseurl,
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
