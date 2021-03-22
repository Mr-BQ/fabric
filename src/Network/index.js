import {request} from "@/Network/request";
export function getNetinfo(id){
    return  request({
        url:'http://47.115.158.68:8888/getNetinfo',
        params:{
            id
        }
    },'get')
}

export function getContainers(id){
    return request({
        url:"http://47.115.158.68:8888/getcontainers",
        params:{
            id:id
        }
    },'get')
}

export function openexplorer(netname){
    return request({
        url:'http://47.115.158.68:8888/startexplorer',
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