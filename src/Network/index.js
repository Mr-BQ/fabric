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

export function getdata(url){
    return request({
        url:'/explorer/getdata',
        params:{
            url:url
        }
    },'get')
}

export function curchannel(){
    return request({
        url:'/explorer/curchannel'
    },'get')
}

export function invoke(netname,chaincode,paramStr,invokeorg){
    return request({
        url:'/invoke',
        params:{
            netname,
            chaincode,
            paramStr,
            invokeorg
        }
    },'post')
}

export function test(){
    return request({
        url:'/test',
        timeout:2000
    },'get')
}

export function option(id,opt){
    return request({
        url:'/option',
        params:{
            container:id,
            opt:opt
        }
    },'post')
}

export function getlogs(id){
    return request({
        url:'/getlogs',
        params:{
            id
        }
    },'get')
}

export function getinspect(id){
    return request({
        url:'/getinspect',
        params:{
            id
        }
    },'get')
}

export function netrestart(netname){
    return request({
        url:'/netrestart',
        params:{
            netname
        }
    },'get')
}

export function netcleanup(netname){
    return request({
        url:'/netcleanup',
        params:{
            netname
        }
    },'get')
}

export function portainerup(){
    return request({
        url:'/portainerup',
    },'get')
}


