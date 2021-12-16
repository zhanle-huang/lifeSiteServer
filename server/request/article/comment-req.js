const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();

// 添加评论
router.post('/', async (req, res) => {
    const commentId = $common.strLen();
    const createTime = new Date();
    let param = ['articleId', 'phone', 'content'];
    let vital = ['articleId', 'phone', 'content'];
    let expand = {commentId, createTime};
    let insertSql = 'insert into articlecomments(id, articleId, phone, content, createTime) values(?, ?, ?, ?, ?)';
    let insertArr = ['commentId', 'articleId', 'phone', 'content', 'createTime'];
    let moduleName = '评论';
    let isExitArr = [];
    let exitTableName = '';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName);
})

// 获取文章评论
router.get('/', (req, res) => {
    let param = ['pageNum', 'pageSize', 'articleId'];
    param = $common.getQueryParam(req, 'query', param);
    let { pageNum, pageSize, articleId } = param;
    pageNum = pageNum > 1 ? pageNum - 1 : 0;
    pageSize = +pageSize;
    let vital = ['pageNum', 'pageSize', 'articleId'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'select * from articlecommentview where articleId=? order by createTime desc limit ?, ?';
        let arr = [articleId, pageNum, pageSize];
        $common.db_mysql.select(sql, arr, async result => {
            let selectAttr = ['id', 'articleId', 'phone', 'content', 'userName', 'userSrc', 'createTime'];
            let resArr = $common.selectHandle(result, selectAttr);
            if (resArr.length > 0) {
                await getReply(resArr);
                console.log('*----', resArr)
                $common.resData.data.list = resArr;
                $common.resData.data.total = resArr.length;
                $common.resData.msg = '获取文章评论成功';
                res.send($common.resData);
            } else {
                $common.resData.data.list = [];
                $common.resData.data.total = 0;
                $common.resData.msg = '获取文章评论成功';
                res.send($common.resData);
            }
        })
    }
})

// 添加回复
router.post('/reply', async (req, res) => {
    const replyId = $common.strLen();
    const createTime = new Date();
    let param = ['commentId', 'phone', 'content'];
    let vital = ['commentId', 'phone', 'content'];
    let expand = {replyId, createTime};
    let insertSql = 'insert into articlereply(id, phone, content, commentId, createTime) values(?, ?, ?, ?, ?)';
    let insertArr = ['replyId', 'phone', 'content', 'commentId', 'createTime'];
    let moduleName = '回复';
    let isExitArr = [];
    let exitTableName = '';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName);
})

// 获取回复
async function getReply(data) {
    for (let k in data) {
        let sql = 'select * from articlereplyview where commentId=? order by createTime asc';
        let arr = [data[k].id];
        let result = await $common.db_mysql.asyncSelect(sql, arr);
        let selectAttr = ['id', 'replyPhone', 'replyContent', 'createTime', 'articleId', 'beReplyPhone', 'beReplyContent', 'replyUserName', 'beReplyUserName', 'replyUserSrc', 'beReplyUserSrc'];
        let reNameArr = ['replyId', 'replyPhone', 'replyContent', 'time', 'articleId', 'beReplyPhone', 'beReplyContent', 'replyUserName', 'beReplyUserName', 'replyUserSrc', 'beReplyUserSrc'];
        let resArr = $common.selectHandle(result, selectAttr, reNameArr);
        data[k].children = resArr;
    }
}

module.exports = router;