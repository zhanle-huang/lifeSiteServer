const $common = require('../../common/common-req.js');
const router = $common.express.Router();

// 获取文章收藏列表请求
router.get('/', async (req, res) => {
    let param = ['pageNum', 'pageSize', 'userId'];
    param = $common.getQueryParam(req, 'query', param);
    let { pageNum, pageSize, userId } = param;
    pageNum = +pageNum;
    pageSize = +pageSize;
    pageNum = pageNum - 1 >= 0 ? pageNum - 1 : 0
    let vital = ['pageNum', 'pageSize', 'userId'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let total = await $common.getTotal('select count(*) as count from articlecollectview where phone=?', [userId]);
        $common.resData.data.total = total
        if (total > 0) {
            let sql = 'select * from articlecollectview where phone=? limit ?, ?';
            let arr = [userId, pageNum * pageSize, pageSize];
            $common.db_mysql.select(sql, arr, result => {
                let selectAttr = ['id', 'articleId', 'phone', 'title', 'content', 'articleAuthor', 'categoryId', 'categoryName', 'categoryType', 'authorName', 'readNum', 'likeNum', 'recommentNum', 'articleTime', 'createTime'];
                let resArr = $common.selectHandle(result, selectAttr);
                if (resArr.length > 0) {
                    $common.resData.data.list = resArr;
                    $common.resData.msg = '获取文章收藏列表成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('获取文章收藏列表失败'));
                }
            })
        } else {
            $common.resData.data.list = [];
            $common.resData.msg = '获取文章收藏列表成功';
            res.send($common.resData);
        }
    }
})


// 添加文章收藏
router.post('/', async (req, res) => {
    let param = ['articleId', 'phone'];
    param = $common.getQueryParam(req, 'body', param);
    let { articleId, phone } = param;
    const id = $common.strLen();
    const createTime = new Date();
    let vital = ['articleId', 'phone'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        if (await $common.isExit([articleId, phone], ['articleId', 'phone'], 'articlecollect')) {
            res.send($common.setErrorData('该文章已收藏'));
        } else {
            let sql = 'insert into articlecollect(id, articleId, phone, createTime) values(?, ?, ?, ?)';
            let arr = [id, articleId, phone, createTime];
            $common.db_mysql.insert(sql, arr, result => {
                if (result) {
                    $common.resData.data = {};
                    $common.resData.msg = '添加文章收藏成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('添加文章收藏失败'));
                }
            })
        }
    }
})

// 删除文章收藏
router.delete('/', (req, res) => {
    let param = ['articleCollectId', 'phone'];
    param = $common.getQueryParam(req, 'body', param);
    console.log(param)
    let { articleCollectId, phone } = param;
    let vital = ['articleCollectId', 'phone'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'delete from articlecollect where id=? and phone=?';
        let arr = [articleCollectId, phone];
        $common.db_mysql.del(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '删除文章收藏成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('删除文章收藏失败'));
            }
        })
    }
})


module.exports = router;