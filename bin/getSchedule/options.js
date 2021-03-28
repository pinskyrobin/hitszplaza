// 各个请求体数据
const reqJwSessionInvalidOptions = {
    hostname: 'jw.hitsz.edu.cn',
    port: 80,
    path:'/session/invalid',
    method: 'GET',
    headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
    'Host': 'jw.hitsz.edu.cn',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    'Cache-Control': 'no-cache'
    }
}

const reqJwCasOptions = {
    hostname:'jw.hitsz.edu.cn',
    port: 80,
    path: '/cas',
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'jw.hitsz.edu.cn',
        'Referer': 'http://jw.hitsz.edu.cn/session/invalid',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
        'Cache-Control': 'no-cache'
    }
}

const ssoCasLoginGet = {
    hostname:'sso.hitsz.edu.cn',
    port: 7002,
    path: '/cas/login?service=http%3A%2F%2Fjw.hitsz.edu.cn%2Fcas',
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'sso.hitsz.edu.cn:7002',
        'Referer': 'http://jw.hitsz.edu.cn/',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
        'Cache-Control': 'no-cache'
    }
}
const ssoCasLoginPostOption = {
    hostname:'sso.hitsz.edu.cn',
    port: 7002,
    path: '/cas/login?service=http%3A%2F%2Fjw.hitsz.edu.cn%2Fcas',
    method: 'POST',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'sso.hitsz.edu.cn:7002',
        'Origin': 'https://sso.hitsz.edu.cn:7002',
        'Referer': ' https://sso.hitsz.edu.cn:7002/cas/login?service=http%3A%2F%2Fjw.hitsz.edu.cn%2Fcas',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    }
}


const loginInfo = {
    username:'',
    password:'',
    rememberMe:'on',
    vc_username:'',
    vc_password:''
}

const reqJwWithTickets = {
    hostname:'jw.hitsz.edu.cn',
    port: 80,
    path: '',
    method: 'GET',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Host': 'jw.hitsz.edu.cn',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    }
}

const jwAuthenticationMain = {
    hostname:'jw.hitsz.edu.cn',
    port: 80,
    path: '/authentication/main',
    method: 'GET',
    headers:{
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Host': 'jw.hitsz.edu.cn',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36'
    }
}
module.exports =  {reqJwSessionInvalidOptions, reqJwCasOptions, ssoCasLoginGet, ssoCasLoginPostOption, loginInfo, reqJwWithTickets, jwAuthenticationMain} ;