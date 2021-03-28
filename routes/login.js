const express = require('express');
const router = express.Router();

const login = require('../bin/getSchedule/login')

const MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb";
const db_url = 'mongodb://127.0.0.1:27017';

router.get('/', function (req, res, next) {
    let username = req.query.username
    let password = req.query.password
    let _openid = req.query.WX_OPENID
    let cookies = []
    login.login(username, password)
        .then(data => {
            console.log('--------------------------------------data')
            console.log(data)
            if (data.error) {
                console.log(data.error)
                res.send(data.error)
            } else {
                cookies = data.JWcookie
                console.log(cookies)
                //TODO:cookie 存入数据库 直接覆盖
                // _openid,学号,密码,cookie
                insertIn(_openid, username, password, data)

                res.json(data)

            }
            res.end()

        })
});

async function insertIn(_openid, username, password, data) {
    MongoClient.connect(db_url, {useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        console.log('successful connect!!!')
        let collection_stu = db.db("STU_INFO").collection('stu')
        let student = {
            _openid: _openid,
            username: username,
            password: password,
            cookie: data.JWcookie,
            ...data.stuInf
        }
        console.log(student)

        //删除之前的
        collection_stu.deleteMany({
            '_openid': _openid,
            'username': username,
        }, function (err, obj) {
            if (err) console.log(err)
            console.log(obj.result.n + " 条文档被删除")
        })

        //插入新的
        collection_stu.insertOne(student).then((res) => {
            console.log('successfully insert:', student)
            db.close()
        }).catch((err) => {
            console.log(err)
        })


    });
}

module.exports = router;