const express = require('express');
const router = express.Router();

const login = require('../bin/getSchedule/login')
const get = require('../bin/getSchedule/get')

const MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb";
const db_url = 'mongodb://121.4.40.110:27017';

router.get('/get',(req,res)=>{
    _callback(req,res)
});

async function _callback (req, res) {
// function _callback (req, res) {

    let cookies = []
    let _openid = req.query.WX_OPENID
    let username = req.query.username
    // 根据_openid找到cookie
    // 从数据库找到cookie
    let result = await queryDB_2(_openid, username)
    console.log('result',result)
    cookies = result.cookie
    let password = result.password
    console.log('cookies',cookies)
    
    
    // cookies = ['route=d6c8d67a0cdfb86693721c017d70b3e1', 'JSESSIONID=1D659745C7986F49038E6F78DFD51F6D']
    let term = {
        xn: req.query.xn,
        xq: req.query.xq,
        cookies: cookies
    }
    get.get(term).then((data) => {

        if(data.error){
            // res.send(data)
            console.log(data)

            // TODO: 从数据库获取学号,密码
            // let username = ;
            // let password = ;
            // 重新登录

            login.login(username,password).then(data => {
                //没登上
                if(data.error) {
                    res.send('登录失效，请检查学号密码')
                }else{//登上啦
                    //先把cookie存数据库
                    let cookie = data.JWcookie
                    updateCookie(_openid,username,cookie)
                    //重新拉去课表
                    _callback(req,res)
                }
            })

        }else{
            //课表存数据库
            backUp(_openid,username,term,data)
            res.json(data)
            res.end()
        }
    })

}

//弃用了，js真的是屎
async function queryDB(_openid,username){
    MongoClient.connect(db_url, (err, db) => {
        if (err)
            throw err;
        console.log('successful connect!!!');
        let collection_stu = db.db("hitszplaza").collection('STU_INFO');
        student = {
            _openid: _openid,
            username: username,
        };
        console.log(student);

        //查找
        // collection_stu.find(student).toArray(function (err, result) {
        //     if (err)
        //         console.log(err);
        //     console.log(result);
        //     db.close();
        //     // return new Promise((resolve,reject) =>{    
        //     //     resolve(result[0])
        //     // })
            
        // });
        // let results = await collection_stu.find(student).toArray()
        // let results = await collection_stu.find(student)
        // console.log(results)

    });
}

async function queryDB_2(_openid,username){


    let conn = null
    let student;
    try {
        conn = await MongoClient.connect(db_url, {useUnifiedTopology: true})
        console.log('successful connect!!!');

        let collection_stu = await conn.db("hitszplaza").collection('STU_INFO');
        student = {
            _openid: _openid,
            username: username,
        };
        console.log(student);

        let results = await collection_stu.find(student).toArray()
        // let results = await collection_stu.find(student)
        console.log(results)
        return results[0]
    } catch (err) {
        console.log("错误：" + err.message);
    } finally {
        if (conn != null) conn.close();
    }
}

//cookie更新
async function updateCookie(_openid,username,cookies){

    let conn = null

    let student;
    try {
        conn = await MongoClient.connect(db_url, {useUnifiedTopology: true})
        console.log('successful connect!!!');

        let collection_stu = await conn.db("hitszplaza").collection('STU_INFO');
        student = {
            _openid: _openid,
            username: username,
        };
        console.log(student);


        let results = await collection_stu.updateMany(student, {
            $set: {
                cookie: cookies
            }
        })
        console.log(results)
    } catch (err) {
        console.log("错误：" + err.message);
    } finally {
        if (conn != null) conn.close();
    }
}


async function backUp(_openid,username,term,data){
    let conn = null;
    let student;
    try {
        conn = await MongoClient.connect(db_url, {useUnifiedTopology: true})
        console.log('successful connect!!!');

        let collection_course = await conn.db("hitszplaza").collection('STU_INFO_BAK');
        student = {
            _openid: _openid,
            username: username,
        };
        // console.log(student);


        await collection_course.deleteMany({
            ...student,
            xn: term.xn,
            xq: term.xq
        })

        await collection_course.insertOne({
            ...student,
            xn: term.xn,
            xq: term.xq,
            CourseList: data.CourseList,
            completeCourseListThisTerm: data.completeCourseListThisTerm
        })
    } catch (err) {
        console.log("err.message")
    } finally {
        if (conn != null) conn.close();
    }
    

 
}
module.exports = router;