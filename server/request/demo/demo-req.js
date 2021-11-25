const $common = require('../../common/common-req.js');
const router = $common.express.Router();

// 获取demo列表请求
router.get('/', async (req, res) => {
    let param = ['pageNum', 'pageSize', 'demoName', 'author', 'phone', 'categoryId'];
    param = $common.getQueryParam(req, 'query', param);
    let { pageNum, pageSize, demoName, author, phone, categoryId } = param;
    pageNum = +pageNum;
    pageSize = +pageSize;
    pageNum = pageNum - 1 >= 0 ? pageNum - 1 : 0
    console.log('param', param)
    let vital = ['pageNum', 'pageSize'];
    if (!$common.vitalParam(param, vital)) {
        res.send(setErrorData('缺少必须参数'));
    } else {
        let total = 0;
        try {
            total = await $common.getTotal('select count(*) as count from demo where (title like ? or (title like ? and author=?)) and category=?', [`%${demoName}%`, `%${demoName}%`, author, categoryId]);
        } catch(e) {
            console.log(e)
        }
        console.log('total', total)
        $common.resData.data.total = total
        if (total > 0) {
            let sql = 'select * from demo where (title like ? or (title like ? and author=?)) and category=? limit ?, ?';
            let arr = [`%${demoName}%`, `%${demoName}%`, author, categoryId, pageNum * pageSize, pageSize];
            $common.db_mysql.select(sql, arr, async result => {
                let selectAttr = ['id', 'title', 'author', 'authorName', 'userSrc', 'path', 'downName', 'downLoadNum', 'readNum', 'likeNum', 'createTime', 'updateTime'];
                let resArr = $common.selectHandle(result, selectAttr);
                if (resArr.length > 0) {
                    $common.resData.data.list = resArr;
                    for (let key in $common.resData.data.list) {
                        let status = await $common.isExit([phone, $common.resData.data.list[key].id], ['phone', 'demoId'], 'democollect');
                        $common.resData.data.list[key].like = status
                        console.log('xx', status, $common.resData.data.list[key])
                    }
                    $common.resData.msg = '获取demo列表成功';
                    console.log('$common.resData', $common.resData)
                    res.send($common.resData);
                } else {
                    res.send(setErrorData('获取demo列表失败'));
                }
            })
        } else {
            $common.resData.data.list = [];
            $common.resData.msg = '获取demo列表成功';
            res.send($common.resData);
        }
    }
})

// 根据id获取demo
router.get('/:id', (req, res) => {
    let param = $common.getQueryParam(req, 'params', ['id']);
    let { id } = param
    let sql = 'select * from categorys where id=?';
    let arr = [id];
    $common.db_mysql.select(sql, arr, result => {
        let selectAttr = ['id', 'name', 'typeName', 'createTime', 'updateTime'];
        let resArr = $common.selectHandle(result, selectAttr);
        console.log('resArr', resArr)
        if (resArr.length > 0) {
            $common.resData.data.list = resArr[0];
            $common.resData.msg = '获取demo成功';
            res.send($common.resData);
        } else {
            res.send($common.setErrorData('获取demo失败'));
        }
    })
})

// 添加demo
router.post('/', (req, res) => {
    let param = ['title', 'author', 'path', 'downName'];
    param = $common.getQueryParam(req, 'body', param);
    let { title, author, path, downName } = param;
    const id = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let vital = ['title', 'author', 'path', 'downName'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数或参数名不对'));
    } else {
        let sql = 'insert into demo(id, title, author, path, downName, createTime, updateTime) values(?, ?, ?, ?, ?, ?, ?)';
        let arr = [id, title, author, path, downName, createTime, updateTime];
        $common.db_mysql.insert(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '添加demo成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('添加demo失败'));
            }
        })
    }
})

// 删除demo
router.delete('/', (req, res) => {
    let param = ['demoId', 'author'];
    param = $common.getQueryParam(req, 'body', param);
    let { demoId, author } = param;
    let vital = ['demoId', 'author'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数或参数名不对'));
    } else {
        let sql = 'delete from demo where id=? and author=?';
        let arr = [demoId, author];
        $common.db_mysql.del(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '删除demo成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('删除demo失败'));
            }
        })
    }
})

// 修改demo
router.put('/', (req, res) => {
    let param = ['id', 'title', 'author', 'path', 'downName'];
    param = $common.getQueryParam(req, 'body', param);
    let { id, title, author, path, downName } = param;
    const updateTime = new Date();
    let vital = ['id', 'title', 'author', 'path', 'downName'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'update demo set title=?, path=?, downName=?, updateTime=? where id=? and author=?';
        let arr = [title, path, downName, updateTime, id, author];
        $common.db_mysql.update(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '修改demo成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('修改demo失败'));
            }
        })
    }
})

module.exports = router;