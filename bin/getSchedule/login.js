const http = require('http')
const https = require('https')
const querystring = require('querystring')
const cheerio = require('cheerio')
const { reqJwSessionInvalidOptions, reqJwCasOptions, ssoCasLoginGet, ssoCasLoginPostOption, loginInfo, reqJwWithTickets, jwAuthenticationMain } = require('./options')
const zlib=require('zlib')

// 返回原始response、新的cookie、html页面数据
const reqFunc = function(option, data=null, pro='HTTP'){
    return new Promise((resolve, reject)=>{
        console.log('sent one req, pro=', pro, data)
        const callBack = (res) => {
            let html=''
            let output
            if(res.headers['content-encoding']=='gzip'){
                const gzip = zlib.createGunzip();
                res.pipe(gzip);
                console.log('gzip')
                output=gzip;
            }else{
                output=res;
            }

            console.log(`状态码: ${res.statusCode}`)
            const cookie = res.headers["set-cookie"]
            output.on('data',function(chunk){
                html += chunk.toString('utf-8')
              });
            output.on('end',()=>{
                resolve({
                    res,
                    cookie,
                    html
                })
            })
        }

        if(pro==='HTTP'){
            req = http.request(option, callBack)
        }else{
            req = https.request(option, callBack)
        }
        if(option.method === 'POST'){
            let content = querystring.stringify(data);
            req.setHeader('Content-Length', content.length)
            // console.log(content)
            req.write(content)
        }
        // console.log(req)
        req.end()
    })
}

const OptionAddCookie = (option, cookieList)=>{
    let temp = {...option}
    temp.headers.Cookie = cookieList.join('; ')
    return temp
}

const processCookie = (cookieStringList)=>{
    return cookieStringList.map((item, idx)=>{
        return item.split(';')[0]
    })
}

const getLoginItem = (html)=>{
    var $ = cheerio.load(html);
    let result = {}
    result.lt = $('input[name=lt]').attr('value');
    result.execution = $('input[name=execution]').attr('value');
    result._eventId   = $('input[name=_eventId]').attr('value');
    return result
}

const processSsoCasLoginPostOption = (option, ssoObj, loginInfo)=>{
    // 处理路径
    let path = option.path.split('?')
    let newCookie = `j_username=${loginInfo.username}`
    ssoObj.cookies.push(newCookie)
    path = path[0] + ';jsessionid=' + ssoObj.cookies[0].split('=')[1] + '?' + path[1]
    let tmp = {...option}
    tmp.path = path
    return tmp
}

const processStuInf = (str)=>{
    let personInf = JSON.parse(str)
    return {
        name:personInf.XM,
        stuID:personInf.XH,
        school:personInf.YXMC,
        major:personInf.ZYMC,
        grade:personInf.NJMC,
        photoUrl:personInf.ZPBSLJ,
        tel:personInf.LXDH,
        email:personInf.DZYX
    }
    
}

exports.login = async function(username,password){
    // 存放sso网页的cookie数据
    let ssoObj = {
        cookies:[]
    }
    // 存放jw网页的cookie数据
    let jwObj = {
        cookies:[]
    }

    let ans = await reqFunc(reqJwSessionInvalidOptions)
    jwObj.cookies.push(...processCookie(ans.cookie))

    const reqJwCasOptionsWithCookie = OptionAddCookie(reqJwCasOptions, jwObj.cookies)
    ans = await reqFunc(reqJwCasOptionsWithCookie)

    ans = await reqFunc(ssoCasLoginGet, null, pro='HTTPS')

    ssoObj.cookies.push(...processCookie(ans.cookie))
    // 获取It和execution， _eventId
    const LoginItem = getLoginItem(ans.html)
    // console.log(ans.html)
    
    //构造完整登录的表单
    let myLoginInfo = loginInfo
    myLoginInfo.username = username
    myLoginInfo.password = password

    const postLoginData = {...myLoginInfo, ...LoginItem}
    // console.log('postLoginData', postLoginData)
    // 构造登录请求的路径
    let ssoCasLoginPostOptionProcessed = processSsoCasLoginPostOption(ssoCasLoginPostOption, ssoObj, myLoginInfo)
    // 开始登录，先将cookie携带上请求
    ssoCasLoginPostOptionProcessed = OptionAddCookie(ssoCasLoginPostOptionProcessed, ssoObj.cookies)

    ans = await reqFunc(ssoCasLoginPostOptionProcessed, postLoginData, pro='HTTPS')

    if(ans.html.match('账号密码验证失败')){
        return {
            error:'账号密码验证失败'

        }
    }

    //存储新cookie
    ssoObj.cookies.push(...processCookie(ans.cookie))
    // console.log(ssoObj)

    // console.log(ans.res.headers.location)
    // 获取ticket数据
    let ticketUrl = ans.res.headers.location.split('/').pop()

    let reqJwWithTicketsWithCookie = OptionAddCookie(reqJwWithTickets, jwObj.cookies)
    // 构造带有ticket的请求链接
    reqJwWithTicketsWithCookie.path = '/' + ticketUrl
    console.log(reqJwWithTicketsWithCookie)
    ans = await reqFunc(reqJwWithTicketsWithCookie)

    jwObj.cookies.push(...processCookie(ans.cookie))
    // 请求主页
    let jwAuthenticationMainWithCookie = OptionAddCookie(jwAuthenticationMain, jwObj.cookies)
    ans = await reqFunc(jwAuthenticationMainWithCookie)
    // console.log(ans.html)

    // console.log(ans.html.indexOf('qxdm'))
    if(ans.html.indexOf('qxdm') != -1)
        success = true;
    else
        success = false;

    let personInfOpt = reqJwWithTicketsWithCookie
    personInfOpt.path = '/UserManager/queryxsxx'
    personInfOpt.method = 'POST'
    personInfOpt = OptionAddCookie(personInfOpt, jwObj.cookies)

    // 获取个人信息
    ans = await reqFunc(personInfOpt)
    console.log(ans.res)
    let student = processStuInf(ans.html)
    console.log(student)

    return {
        hasLogin:success,
        stuInf:student,
        JWcookie:jwObj.cookies
    }
}

// 运行函数
// const a = login('190110716','cdec1234')
// a.then(data=>{
//     console.log(data)
//     console.log(a)
// })
// console.log(a)



