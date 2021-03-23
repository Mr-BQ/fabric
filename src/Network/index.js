import {request} from "@/Network/request";
export function getNetinfo(id){
    return  request({
        url:'/getNetinfo',
        params:{
            id
        }
    },'get')
}

export function getContainers(id){
    return request({
        url:"/getcontainers",
        params:{
            id:id
        }
    },'get')
}

export function openexplorer(netname){
    return request({
        url:'/startexplorer',
        params:{
            netname
        }
    },'get')
}

export function explorerlogin(netname){
    return request({
        url:'http://47.115.158.68:7201/auth/login',
        data:{
            network:netname,
            user:"exploreradmin",
            password:"exploreradminpw"

        }
    },'post')
}
