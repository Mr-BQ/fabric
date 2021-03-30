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
        url:'/explorer/start/' + netname + '_mininet'
    },'get')
}

// export function explorerlogin(netname){
//     return request({
//         url:'http://47.115.158.68:7201/auth/login',
//         headers:{
//             'referrer Policy': 'no-referrer'
//         },
//         data:{
//             network:netname,
//             user:"exploreradmin",
//             password:"exploreradminpw"
//         },
//         method:'post'
//     })
// }

export function deploychaincode(form){
    return request({
        url:'/deploychaincode',
        data:form,
        method:'post'
    })
}

export function currentexolorer(){
    return request({
        url:'/explorer'
    },'get')
}

export function stopexplorer(netname){
    return request({
        url:'/explorer/stop/' + netname,
    },'get')
}

export function ExplorerStatus(){
    return request({
        url:'/explorer/status'
    },'get')
}
