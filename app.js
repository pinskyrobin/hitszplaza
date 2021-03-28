const express = require('express');
const logger = require('morgan');

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({extended: false});

const getScheduleRouter = require('./routes/get');
const loginRouter = require('./routes/login');

const app = express();



app.use(logger('dev'));

app.use('/get', getScheduleRouter);
app.use('/login', loginRouter);

//
// const login = require('./bin/getSchedule/login')
// const get = require('./bin/getSchedule/get')
// const fs = require('fs')
//
// app.get('/getSchedule', (req, res) => {
//     const a = login.login('190110716', 'cdec1234')
//     let cookies = []
//
//     a.then(data => {
//         // console.log('--------------------------------------data')
//         // console.log(data)
//         cookies = data.JWcookie
//         console.log("****" + req.query.xn)
//         // console.log(cookies)
//         get.get({
//             xn: req.query.xn,
//             xq: req.query.xq,
//             cookies: cookies
//         }).then(data => {
//             res.json(JSON.stringify(data))
//             fs.writeFile('getRes.json', JSON.stringify(data), function (err) {
//                 if (err)
//                     throw err
//             })
//         })
//     })
// })


// 监听3000端口
let server = app.listen(3000, '127.0.0.1', () => {
    let host = server.address().address // host域
    let port = server.address().port // 端口号

    console.log(`Server running at http://${host}:${port}`)
})


module.exports = app;
