var path = require('path');
var express = require('express');
const https = require('https');
const fs = require('fs');
const http = require('http');
const yun = express();
const os = require('os');
const routerReq = require('./config/router-req.js')
// 读取证书,__dirname获取当前文件所在目录__filename是获取文件路径
let key = fs.readFileSync(path.join(__dirname, '/ssl/server.key'), 'utf8'),
    cert = fs.readFileSync(path.join(__dirname, '/ssl/server.pem'), 'utf8');
// 创建证书对象
let cas = { key, cert };

const port = 3000;
const ports = 3001;
const hostname = '127.0.0.1'; 
// 获取操作系统
const platform = os.platform();
console.log('操作系统为：', platform)
if(platform === 'linux') {
    hostname = '0.0.0.0'
    ports = 443
    port = 80
}
// 引入请求体中间处理
const bodyParser = require('body-parser');
const $common = require('./common/common-req.js')
// 创建服务器

// create application/json parser， 处理json格式
yun.use(bodyParser.json());
// create application/x-www-form-urlencoded parser，处理普通body格式
yun.use(bodyParser.urlencoded({ extended: false }));
// 监听静态资源
const staticPath = path.resolve('', path.join(__dirname, ''), '../public');
yun.use(`/${$common.projectName}/public`, express.static(staticPath));
console.log(staticPath)
// yun.use('/yun/public', express.static('public'));
let yunHttp = http.createServer(yun);
let yunHttps = https.createServer(cas, yun);

// 跨域设置
yun.all("*", function(req, res, next) {
    // 请求拦截处理
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Headers', 'ontent-Type,Content-Length,Authorization,Accept,X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('X-Powered-By', '3.2.1')
	if (req.method == 'OPTIONS') res.send(200);
	// /让options请求快速返回/
	else {
        let token = req.query.token ? req.query.token : req.body.token;
        let userId = req.query.userId ? req.query.userId : req.body.userId;
        console.log(req.originalUrl)
        // if(urlIndentify(req.originalUrl) || obsId) {
        //     if(!token || !userId) {
        //         errorData.msg = '身份鉴定失败'
        //         res.send(errorData)
        //         return;
        //     }
        //     let tk = enCodePWD(token, userId)
        //     let tokenArr = [userId, tk];
        //     let tokenSql = 'select token, idType from users where userId=? and token=?';
        //     db_mysql.select(tokenSql, tokenArr, tokenRes => {
        //         if(tokenRes && tokenRes.length > 0) {
        //             if(obsId) {
        //                 if(tokenRes[0].idType === '2') {
        //                     next();
        //                     return;
        //                 } else {
        //                     errorData.msg = '身份鉴定失败'
        //                     res.send(errorData)
        //                 }
        //             } else {
        //                 next();
        //                 return;
        //             }
        //         } else {
        //             errorData.msg = '身份鉴定失败'
        //             res.send(errorData)
        //         }
        //     })
        // } else {
            next();
        // }
    }
});

// 路由中转
// 用户接口
yun.use(`/${$common.projectName}/user`, routerReq.userInfoReq)
// 文章接口
yun.use(`/${$common.projectName}/article`, routerReq.articleReq)
// 文章类型接口
yun.use(`/${$common.projectName}/category`, routerReq.categoryReq)
// 文章收藏接口
yun.use(`/${$common.projectName}/collect/article`, routerReq.articleCollectReq)
// 留言
yun.use(`/${$common.projectName}/leaving`, routerReq.leavingReq)
// demo
yun.use(`/${$common.projectName}/demo`, routerReq.demoReq)
// demo收藏接口
yun.use(`/${$common.projectName}/collect/demo`, routerReq.demoCollectReq)
// 权限
yun.use(`/${$common.projectName}/manage/right`, routerReq.manageRight)
// 角色
yun.use(`/${$common.projectName}/manage/role`, routerReq.manageRole)
// 角色权限授予
yun.use(`/${$common.projectName}/manage/rightToRole`, routerReq.RightToRole)
// 用户角色授予
yun.use(`/${$common.projectName}/manage/roleToUser`, routerReq.roleToUser)
// 系统菜单
yun.use(`/${$common.projectName}/manage/sysmenu`, routerReq.sysMenu)
// 轮播图
yun.use(`/${$common.projectName}/common/carousel`, routerReq.carouselReq)


// 监听服务端口
yunHttp.listen(port, hostname, function() {
	console.log(`服务器启动成功！-- http://${hostname}:${port}/${$common.projectName}`)
})
yunHttps.listen(ports, hostname, function() {
	console.log(`服务器启动成功！-- https://${hostname}:${ports}/${$common.projectName}`)
})



