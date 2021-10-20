// 用户相关
const userInfoReq = require('../request/user/userInfo-req.js');
const leavingReq = require('../request/user/leaving-req.js');
// 文章相关
const articleReq = require('../request/article/article-req.js');
const categoryReq = require('../request/article/category-req.js');
const articleCollectReq = require('../request/article/collect-req.js');
// demo
const demoReq = require('../request/demo/demo-req.js');
const demoCollectReq = require('../request/demo/collect-req.js');
    
var router = {
    userInfoReq,
    articleReq,
    categoryReq,
    leavingReq,
    demoReq,
    articleCollectReq,
    demoCollectReq
}

module.exports = router;