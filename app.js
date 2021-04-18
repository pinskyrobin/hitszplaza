const express = require('express');
const logger = require('morgan');

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({extended: false});

const getScheduleRouter = require('./routes/get');
const loginRouter = require('./routes/login');

const app = express();

app.use(logger('dev'));

app.use('/wx_api', getScheduleRouter);
app.use('/wx_api', loginRouter);


// 监听3000端口
let server = app.listen(3000, () => {
    let host = server.address().address // host域
    let port = server.address().port // 端口号

    console.log(`Server running at http://${host}:${port}`)
})


module.exports = app;
