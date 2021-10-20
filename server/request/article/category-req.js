const $common = require('../../common/common-req.js');
const router = $common.express.Router();

// 获取分类列表请求
router.get('/', async (req, res) => {
    let param = ['pageNum', 'pageSize', 'categoryName'];
    param = $common.getQueryParam(req, 'query', param);
    let { pageNum, pageSize, categoryName } = param;
    pageNum = +pageNum;
    pageSize = +pageSize;
    pageNum = pageNum - 1 >= 0 ? pageNum - 1 : 0
    let vital = ['pageNum', 'pageSize'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let total = await $common.getTotal('select count(*) as count from categorys where name like ?', [`%${categoryName}%`]);
        console.log('total', total)
        $common.resData.data.total = total
        if (total > 0) {
            let sql = 'select * from categorys where name like ? limit ?, ?';
            let arr = [`%${categoryName}%`, pageNum * pageSize, pageSize ];
            $common.db_mysql.select(sql, arr, result => {
                let selectAttr = ['id', 'name', 'typeName', 'createTime', 'updateTime'];
                let resArr = $common.selectHandle(result, selectAttr);
                if (resArr.length > 0) {
                    $common.resData.data.list = resArr;
                    $common.resData.msg = '获取分类列表成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('获取分类列表失败'));
                }
            })
        } else {
            $common.resData.data.list = [];
            $common.resData.msg = '获取分类列表成功';
            res.send($common.resData);
        }
    }
})

// 根据id获取分类
router.get('/:id', (req, res) => {
    let param = $common.getQueryParam(req, 'params', ['id']);
    let { id } = param
    let sql = 'select * from categorys where id=?';
    let arr = [id];
    $common.db_mysql.select(sql, arr, result => {
        let selectAttr = ['id', 'name', 'typeName', 'createTime', 'updateTime'];
        let resArr = $common.selectHandle(result, selectAttr);
        if (resArr.length > 0) {
            $common.resData.data.list = resArr[0];
            $common.resData.msg = '获取分类成功';
            res.send($common.resData);
        } else {
            res.send($common.setErrorData('获取分类失败'));
        }
    })
})

// 添加分类
router.post('/', (req, res) => {
    let param = ['name', 'type'];
    param = $common.getQueryParam(req, 'body', param);
    let { name, type } = param;
    const id = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let vital = ['name', 'type'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'insert into categorys(id, name, typeName, createTime, updateTime) values(?, ?, ?, ?, ?)';
        let arr = [id, name, type, createTime, updateTime];
        $common.db_mysql.insert(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '添加分类成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('添加分类失败'));
            }
        })
    }
})

// 删除分类
router.delete('/', (req, res) => {
    let param = ['categoryId'];
    param = $common.getQueryParam(req, 'body', param);
    let { categoryId } = param;
    let vital = ['categoryId'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'delete from categorys where id=?';
        let arr = [categoryId];
        $common.db_mysql.del(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '删除分类成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('删除分类失败'));
            }
        })
    }
})

// 修改分类
router.put('/', (req, res) => {
    let param = ['id', 'name', 'type'];
    param = $common.getQueryParam(req, 'body', param);
    let { id, name, type } = param;
    const updateTime = new Date();
    let vital = ['id', 'name', 'type'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'update categorys set name=?, typeName=?, updateTime=? where id=?';
        let arr = [name, type, updateTime, id];
        $common.db_mysql.update(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = '修改分类成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('修改分类失败'));
            }
        })
    }
})

module.exports = router;