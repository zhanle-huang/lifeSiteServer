const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();

// 获取某个用户的推荐文章
// router.get('/recommend', (req, res) => {
//     let param = ['phone'];
//     param = $common.getQueryParam(req, 'query', param);
//     let { pageNum, pageSize, articleName } = param;
// })
// 获取某用户的最新文章前5条
router.get('/new', (req, res) => {
    let param = ['phone'];
    param = $common.getQueryParam(req, 'query', param);
    let { phone } = param;
    let vital = ['phone'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'select * from articleview order by updateTime desc limit 0, 5';
        let arr = [];
        $common.db_mysql.select(sql, arr, result => {
            let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
            let resArr = $common.selectHandle(result, selectAttr);
            if (resArr.length > 0) {
                $common.resData.data.list = resArr;
                $common.resData.data.total = resArr.length;
                $common.resData.msg = '获取最新文章列表成功';
                res.send($common.resData);
            } else {
                $common.resData.data.list = [];
                $common.resData.data.total = 0;
                $common.resData.msg = '获取最新文章列表成功';
                res.send($common.resData);
            }
        })
    }
})

router.get('/newAll', (req, res) => {
    let param = [];
    let vital = [];
    let totalSql = 'select count(*) as count from articleview';
    let expand = [];
    let getSql = 'select * from articleview order by updateTime desc limit ?, ?';
    let getArr = [];
    let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let reName = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let moduleName = '最新文章列表';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})

router.get('/hotAll', (req, res) => {
    let param = [];
    let vital = [];
    let totalSql = 'select count(*) as count from articleview';
    let expand = [];
    let getSql = 'select * from articleview order by readNum desc limit ?, ?';
    let getArr = [];
    let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let reName = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let moduleName = '最新文章列表';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})

// 获取某用户的最热门的文章前5条
router.get('/hot', (req, res) => {
    let param = ['phone'];
    param = $common.getQueryParam(req, 'query', param);
    let { phone } = param;
    let vital = ['phone'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'select * from articleview order by readNum desc limit 0, 5';
        let arr = [];
        $common.db_mysql.select(sql, arr, result => {
            let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
            let resArr = $common.selectHandle(result, selectAttr);
            if (resArr.length > 0) {
                $common.resData.data.list = resArr;
                $common.resData.data.total = resArr.length;
                $common.resData.msg = '获取最热门文章列表成功';
                res.send($common.resData);
            } else {
                $common.resData.data.list = [];
                $common.resData.data.total = 0;
                $common.resData.msg = '获取最热门文章列表成功';
                res.send($common.resData);
            }
        })
    }
})

// 获取用户的归档列表
router.get('/time', (req, res) => {
    let param = ['phone'];
    param = $common.getQueryParam(req, 'query', param);
    let { phone } = param;
    let vital = ['phone'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'select * from articles where author=?';
        let arr = [phone]
        $common.db_mysql.select(sql, arr, result => {
            let selectAttr = ['updateTime'];
            let resArr = $common.selectHandle(result, selectAttr);
            $common.resData.data = {}
            if (resArr.length > 0) {
                console.log(resArr)
                $common.resData.data.list = handleTimeList(resArr);
                $common.resData.msg = '获取归档列表成功';
                res.send($common.resData);
            } else {
                $common.resData.data.list = [];
                $common.resData.msg = '获取归档列表成功';
                res.send($common.resData);
            }
        })
    }
})

function handleTimeList(data) {
    let result = [];
    data.map(item => {
        let d = new Date(item.updateTime);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let time = '' + year + month;
        console.log(time)
        if (result.indexOf(time) === -1) {
            result.push(time);
        }
    })
    return result;
}


module.exports = router;