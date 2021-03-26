import {request} from "@/Network/request";
export function getNetinfo(id){
    return  request({
        url:'/getNetinfo',
        params:{
            id:id?id+'_mininet':null
        }
    },'get')
}

export function getContainers(id){
    return request({
        url:"/getcontainers",
        params:{
            id:id+'_mininet'
        }
    },'get')
}

export function openexplorer(netname){
    return request({
        url:'/startexplorer',
        params:{
            netname:netname + '_mininet'
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

export function deploychaincode(form){
    return request({
        url:'http://47.115.158.68:8888/deploychaincode',
        data:form,
        method:'post'
    })
}
