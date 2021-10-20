const $common = require('../../common/common-req.js');
const router = $common.express.Router();

// 获取留言列表请求
router.get('/', async (req, res) => {
    let param = ['pageNum', 'pageSize'];
    param = $common.getQueryParam(req, 'query', param);
    let { pageNum, pageSize } = param;
    pageNum = +pageNum;
    pageSize = +pageSize;
    pageNum = pageNum - 1 >= 0 ? pageNum - 1 : 0
    let vital = ['pageNum', 'pageSize'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let total = await $common.getTotal('select count(*) as count from leavingview');
        $common.resData.data.total = total
        if (total > 0) {
            let sql = 'select * from leavingview limit ?, ?';
            let arr = [pageNum * pageSize, pageSize];
            $common.db_mysql.select(sql, arr, result => {
                let selectAttr = ['id', 'phone', 'userName', 'userSrc', 'content', 'createTime'];
                let resArr = $common.selectHandle(result, selectAttr);
                if (resArr.length > 0) {
                    $common.resData.data.list = resArr;
                    $common.resData.msg = '获取留言列表成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('获取留言列表失败'));
                }
            })
        } else {
            $common.resData.data.list = [];
            $common.resData.msg = '获取留言列表成功';
            res.send($common.resData);
        }
    }
})


// 添加留言
router.post('/', (req, res) => {
    let param = ['userId', 'content'];
    param = $common.getQueryParam(req, 'body', param);
    let { userId, content } = param;
    const id = $common.strLen();
    const createTime = new Date();
    let vital = ['userId', 'content'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'insert into leaving(id, phone, content, createTime) values(?, ?, ?, ?)';
        let arr = [id, userId, content, createTime];
        $common.db_mysql.insert(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '添加留言成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('添加留言失败'));
            }
        })
    }
})

// 删除留言
router.delete('/', (req, res) => {
    let param = ['leavingId'];
    param = $common.getQueryParam(req, 'body', param);
    console.log(param)
    let { leavingId } = param;
    let vital = ['leavingId'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'delete from leaving where id=?';
        let arr = [leavingId];
        $common.db_mysql.del(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '删除留言成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('删除留言失败'));
            }
        })
    }
})


module.exports = router;