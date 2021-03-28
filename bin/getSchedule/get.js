

const http = require('http')
const querystring = require('querystring')
const zlib=require('zlib')


const reqFunc = function(option, data=null, pro='HTTP'){
  return new Promise((resolve, reject)=>{
      console.log('sent one req, pro=', pro, data)
      const callBack = (res) => {
          // console.log(req)
          // console.log(res)
          let html=''
          let output
          if(res.headers['content-encoding']=='gzip'){
              var gzip=zlib.createGunzip();
              res.pipe(gzip);
              console.log('gzip')
              output=gzip;
          }else{
              output=res;
          }

          console.log(`状态码: ${res.statusCode}`)
          const cookie = res.headers["set-cookie"]
          console.log(cookie)
          output.on('data',function(chunk){
              html += chunk.toString('utf-8')
            });
          output.on('end',()=>{
              // console.log(output)
              // console.log(html)
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
      
      // console.log(req)
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
  // console.log(option,cookieList)
  // console.log(temp.headers.Cookie)
  return temp
}
const defaultPostOption = {
  hostname:'jw.hitsz.edu.cn',
  // port: 7002,
  path: '/xszykb/queryxszykbzong',
  method: 'POST',
  headers: {
      'Accept':'*/*',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'jw.hitsz.edu.cn',
      'Origin': 'http://jw.hitsz.edu.cn',
      'Referer': 'http://jw.hitsz.edu.cn/authentication/main',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  }
}

const _OptionAddCookie = (option, cookieList)=>{
    let temp = {...option}
    temp.headers.Cookie = cookieList.join('; ')
    // console.log(option,cookieList)
    // console.log(temp.headers.Cookie)
    return temp
}

const resolveWeek = (str)=>{//'12-
  let list = str.split(',')
  // console.log(list)
  tmp = []
  for(let idx in list){
      if(list[idx].match(/[0-9]+-[0-9]+/)){
          let s_e = list[idx].match(/[0-9]+/g)
          let start = parseInt(s_e[0])
          let end = parseInt(s_e[1])
          // console.log('start:',start)
          // console.log('eng:',end)
          for(let i=start;i<=end;i++){
              tmp.push(i)
              // console.log('i:',i)
          }
      }else{
          tmp.push(parseInt(
            list[idx].match(/[0-9]+/)[0]
          ))
      }
  }
  // console.log(tmp)
  return tmp
}

const resolveLabPeriodInDay = (str)=>{//'3-4'->2;'9-12'->[5,6]
    let s_e = str.match(/[0-9]+/g)
    let start = parseInt(s_e[0])
    let end = parseInt(s_e[1])
    if(end - start > 1){
    let tmp = [(start+ 1)/2 ]
        let n = (end - start + 1)/2
        for(let i = 1;i <= n-1;i++){
            tmp[i] = tmp[i-1] + 1;
        }
        // console.log(tmp) 
        return(tmp)
    }else{
        return (start+ 1)/2
    }
}

const resolveCourseList = (originalCourseList)=>{
  let newCourseList = []
  for (idx in originalCourseList){
      // console.log(idx)
      let templist = originalCourseList[idx].SKSJ.split('\n')
      let course = {
          name:"",
          teacher:"",
          week:"",
          dayInWeek:0,
          periodInDay:0,
          location:"",
          inLab:false
      }
      course.name = templist[0]
    //   console.log(originalCourseList[idx])
    //   console.log(originalCourseList[idx].KEY)
      mt = originalCourseList[idx].KEY.match(/xq[1-7]/)
      if(mt){
          course.dayInWeek = parseInt(
            mt[0][2]
        )
      }else{
          //专门表示未排课/网课
        course.dayInWeek = 0    //专门表示未排课/网课
      }
      
      // console.log(originalCourseList[idx].SKSJ)
      if(course.dayInWeek == 0){
        
        console.log('未排课/网课课程',templist)
      }
      else if(originalCourseList[idx].SKSJ.search(/【实验】/) != -1){//解析实验课
          // console.log('实验',templist)
          course.week = templist[1].replace(/\[.*?\]/,"")
          course.periodInDay = templist[1].match(/\[.*?\]/)[0]
          course.periodInDay = resolveLabPeriodInDay(course.periodInDay)
          course.location = templist[2].replace(/[\[\]]/g,'')
          course.inLab = true
      }else{//一般课程
          console.log('一般课程',templist)
          course.teacher = templist[1].replace(/[\[\]]/g,'')
          course.week = templist[2].match(/\[.*?\]/)[0]
          course.location = templist[2].replace(/\[.*?\]/,"").replace(/[\[\]]/g,'')
          course.periodInDay = parseInt(
              originalCourseList[idx].KEY.match(/jc[1-7]/)[0][2]
          )
      }
      if(course.week){
        course.week = resolveWeek(course.week)

      }
      // console.log(course)
      newCourseList[idx] = {
          ...course,
          ...originalCourseList[idx]
      }
      delete newCourseList[idx].SKSJ_EN
      delete newCourseList[idx].RWH
      // delete newCourseList[idx].SKSJ
  }
  return newCourseList
}

const getCompleteCourseListThisTerm = (CourseList)=>{
    let completeCourse = [];
    for(let wk = 1;wk<=20;wk++){
        completeCourse[wk] = []
        for(let d = 1;d <= 7;d++){
            completeCourse[wk][d] = []
            for(let p = 1;p <= 6;p++){
                completeCourse[wk][d][p] = -1
            }
        }
    }
    // console.log(completeCourse)
    for(let i in CourseList){
        let crs = CourseList[i] 
        for(let j in crs.week){
            let wk = crs.week[j]
            let day = crs.dayInWeek
            let per = crs.periodInDay
            if(typeof(per) == 'number'){
                // console.log('week:',wk,'day:',day,'per:',per,'course:',i)
                completeCourse[wk][day][per] = parseInt(i)
            }else{
              for(let k in per){
                let p = per[k]
                // console.log('week:',wk,'day:',day,'p:',p,'course:',i)
                completeCourse[wk][day][p] = parseInt(i)
              }
            }
        }
    }
    // console.log(completeCourse)
    return(completeCourse)
}
// 云函数入口函数
exports.get = async function(event) {
  // console.log(event)
  // console.log(event.cookies)
  
  //构造带cookieoption
  const optWithcookies = OptionAddCookie(defaultPostOption,event.cookies)
  let data = {
      xn:'2019-2020',
      xq:'2'
  }
  data.xn = event.xn
  data.xq = event.xq
  let ans = await reqFunc(optWithcookies,data)
  // console.log(ans.html)
  // console.log(ans.res)
  if(!ans.html.match('SKSJ')){
    return {
      error:'请重新登录'
      
    }
  }
  //原始数据
  let originalCourseList = JSON.parse(ans.html)

  //处理数据
  let CourseList = resolveCourseList(originalCourseList)
  console.log(CourseList)
  
  console.log(originalCourseList)
  

  //构造学期总课表
  let completeCourseListThisTerm =getCompleteCourseListThisTerm(CourseList)
    

  console.log(completeCourseListThisTerm)//-1为空，其他数字指向CourseList的课程

  // console.log(event)
  return {
    cc: event.cookies,
    CourseList:CourseList,
    completeCourseListThisTerm:completeCourseListThisTerm
  }
}

let opt = {
    xn:'2019-2020',
    xq:'2',
    cookies:['route=3b070995537f3ced53f80b7b8ee3a634', 'JSESSIONID=4A8C3E0051DB0BB665CED0C61F66CD93']


}

//@test
// const a = get(opt)
// a.then(data=>{
//     console.log(data)
//     console.log(a)
// })
// console.log(a)