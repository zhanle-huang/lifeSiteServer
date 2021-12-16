const $common = require('../../common/common-req.js');
const router = $common.express.Router();
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const moment = require('moment');
const requestHandler = require('../../common/request-handler.js');


// 获取文章列表请求
router.get('/', async (req, res) => {
    let param = ['pageNum', 'pageSize', 'articleName', 'categoryId'];
    param = $common.getQueryParam(req, 'query', param);
    let { pageNum, pageSize, articleName, categoryId } = param;
    let append = '';
    let appendArr = [];
    if (categoryId !== '' && categoryId !== undefined) {
        append = ' and categoryId=?';
        appendArr.push(categoryId)
    }
    pageNum = +pageNum;
    pageSize = +pageSize;
    pageNum = pageNum - 1 >= 0 ? pageNum - 1 : 0
    let vital = ['pageNum', 'pageSize'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let total = await $common.getTotal('select count(*) as count from articleview where title like ?' + append, [`%${articleName}%`, ...appendArr]);
        $common.resData.data.total = total
        if (total > 0) {
            let sql = 'select * from articleview where title like ?' + append +' limit ?, ?';
            let arr = [`%${articleName}%`, ...appendArr, pageNum * pageSize, pageSize ];
            $common.db_mysql.select(sql, arr, result => {
                let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'authorSrc', 'userName', 'coverSrc', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
                let resArr = $common.selectHandle(result, selectAttr);
                if (resArr.length > 0) {
                    resArr.map(item => {
                        if (item.content) {
                            item.content = decoder.write(item.content);
                        }
                    })
                    $common.resData.data.list = resArr;
                    $common.resData.msg = '获取文章列表成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('获取文章列表失败'));
                }
            })
        } else {
            $common.resData.data.list = [];
            $common.resData.msg = '获取文章列表成功';
            res.send($common.resData);
        }
    }
})

// 根据id获取文章
router.get('/getArticleById', (req, res) => {
    let param = $common.getQueryParam(req, 'query', ['articleId']);
    let { articleId } = param
    let sql = 'select * from articleview where id=?';
    let arr = [articleId];
    $common.db_mysql.select(sql, arr, result => {
        let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'authorSrc', 'userName', 'coverSrc', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
        let resArr = $common.selectHandle(result, selectAttr);
        if (resArr.length > 0) {
            // blob转字符串
            if (result[0].content) {
                resArr[0].content = decoder.write(result[0].content);
            } else {
                resArr[0].content = ''
            }
            $common.resData.data.list = resArr[0];
            $common.resData.msg = '获取文章成功';
            res.send($common.resData);
        } else {
            res.send($common.setErrorData('获取文章失败'));
        }
    })
})

// 添加文章
router.post('/', (req, res) => {
    let param = ['categoryId', 'title', 'author', 'content'];
    param = $common.getQueryParam(req, 'body', param);
    let { categoryId, title, author, content } = param;
    const id = $common.strLen();
    const coverSrc = 'http://127.0.0.1:3000/lifeSite/public/images/user-head.png'
    const createTime = new Date();
    const updateTime = new Date();
    let vital = ['categoryId', 'title', 'author', 'content'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'insert into articles(id, categoryId, content, title, author, coverSrc, createTime, updateTime) values(?, ?, ?, ?, ?, ?, ?, ?)';
        let arr = [id, categoryId, content, title, author, coverSrc, createTime, updateTime];
        $common.db_mysql.insert(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '添加文章成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('添加文章失败'));
            }
        })
    }
})

// 删除文章
router.delete('/', (req, res) => {
    let param = ['articleId', 'author'];
    param = $common.getQueryParam(req, 'body', param);
    let { articleId, author } = param;
    let vital = ['articleId', 'author'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'delete from articles where id=? and author=?';
        let arr = [articleId, author];
        $common.db_mysql.del(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '删除文章成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('删除文章失败'));
            }
        })
    }
})

// 修改文章
router.put('/', (req, res) => {
    let param = ['id', 'categoryId', 'title', 'author'];
    param = $common.getQueryParam(req, 'body', param);
    let { id, categoryId, title, author } = param;
    const updateTime = new Date();
    let vital = ['id', 'categoryId', 'title', 'author'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'update articles set categoryId=?, title=?, updateTime=? where id=? and author=?';
        let arr = [categoryId, title, updateTime, id, author];
        $common.db_mysql.update(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '修改文章成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('修改文章失败'));
            }
        })
    }
})

// 根据时间获取文章

router.get('/getArticleByTime', async(req, res) => {
    let time = req.query.time + '01000000';
    let startTime = moment(time, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
    let endTime = moment(startTime, 'YYYY-MM-DD HH:mm:ss').add(1, 'month').format('YYYY-MM-DD HH:mm:ss')
    let param = ['pageNum', 'pageSize', 'author'];
    let vital = ['pageNum', 'pageSize', 'author'];
    let totalSql = 'select count(*) as count from articleview where author=? and updateTime between ? and ?';
    let expand = {startTime, endTime};
    let getSql = 'select * from articleview where author=? and updateTime between ? and ? order by updateTime limit ?, ?';
    let getArr = ['author', 'startTime', 'endTime'];
    let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'authorSrc', 'userName', 'coverSrc', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let reName = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'authorSrc', 'userName', 'coverSrc', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let moduleName = '文章';
    let checkBlob = true;
    let blobArr = ['content'];
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName, checkBlob, blobArr);
})

// 根据用户获取文章
router.get('/getArticleByAuthor', (req, res) => {
    let param = ['pageNum', 'pageSize', 'author'];
    let vital = ['pageNum', 'pageSize', 'author'];
    let totalSql = 'select count(*) as count from articleview where author=?';
    let expand = {};
    let getSql = 'select * from articleview where author=? order by updateTime limit ?, ?';
    let getArr = ['author'];
    let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'authorSrc', 'userName', 'coverSrc', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let reName = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'authorSrc', 'userName', 'coverSrc', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
    let moduleName = '文章';
    let checkBlob = true;
    let blobArr = ['content'];
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName, checkBlob, blobArr);
})

module.exports = router;