const $common = require('../../common/common-req.js');
const router = $common.express.Router();

// 获取demo收藏列表请求
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
        let total = await $common.getTotal('select count(*) as count from democollectview where phone=?', [userId]);
        $common.resData.data.total = total
        if (total > 0) {
            let sql = 'select * from democollectview where phone=? limit ?, ?';
            let arr = [userId, pageNum * pageSize, pageSize];
            $common.db_mysql.select(sql, arr, result => {
                let selectAttr = ['id', 'demoId', 'phone', 'title', 'demoAuthor', 'authorName', 'path', 'downName', 'readNum', 'likeNum', 'downLoadNum', 'demoTime', 'createTime'];
                let resArr = $common.selectHandle(result, selectAttr);
                if (resArr.length > 0) {
                    $common.resData.data.list = resArr;
                    $common.resData.msg = '获取demo收藏列表成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('获取demo收藏列表失败'));
                }
            })
        } else {
            $common.resData.data.list = [];
            $common.resData.msg = '获取demo收藏列表成功';
            res.send($common.resData);
        }
    }
})


// 添加demo收藏
router.post('/', async (req, res) => {
    let param = ['demoId', 'phone'];
    param = $common.getQueryParam(req, 'body', param);
    let { demoId, phone } = param;
    const id = $common.strLen();
    const createTime = new Date();
    let vital = ['demoId', 'phone'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        if (await $common.isExit([demoId, phone], ['demoId', 'phone'], 'democollect')) {
            res.send($common.setErrorData('该demo已收藏'));
        } else {
            let sql = 'insert into democollect(id, demoId, phone, createTime) values(?, ?, ?, ?)';
            let arr = [id, demoId, phone, createTime];
            $common.db_mysql.insert(sql, arr, result => {
                if (result) {
                    $common.resData.data = {};
                    $common.resData.msg = '添加demo收藏成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('添加demo收藏失败'));
                }
            })
        }
    }
})

// 删除demo收藏
router.delete('/', (req, res) => {
    let param = ['demoCollectId', 'phone'];
    param = $common.getQueryParam(req, 'body', param);
    console.log(param)
    let { demoCollectId, phone } = param;
    let vital = ['demoCollectId', 'phone'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'delete from democollect where id=? and phone=?';
        let arr = [demoCollectId, phone];
        $common.db_mysql.del(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '删除demo收藏成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('删除demo收藏失败'));
            }
        })
    }
})


module.exports = router;