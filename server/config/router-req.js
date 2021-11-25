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
// 权限
const manageRight = require('../request/manage/manage-right-req.js');
// 角色
const manageRole = require('../request/manage/manage-role-req.js');
// 角色权限授予
const RightToRole = require('../request/manage/right-role-req.js');
// 角色权限授予
const roleToUser = require('../request/manage/role-user-req.js');
// 系统菜单
const sysMenu = require('../request/manage/sys-menu-req.js');
    
// 轮播图
const carouselReq = require('../request/common/carousel-req.js');
var router = {
    userInfoReq,
    articleReq,
    categoryReq,
    leavingReq,
    demoReq,
    articleCollectReq,
    demoCollectReq,
    manageRight,
    manageRole,
    RightToRole,
    roleToUser,
    sysMenu,
    carouselReq
}

module.exports = router;