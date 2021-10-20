const $common = require('../../common/common-req.js');
const router = $common.express.Router();

// 获取文章列表请求
router.get('/', async (req, res) => {
    let param = ['pageNum', 'pageSize', 'articleName'];
    param = $common.getQueryParam(req, 'query', param);
    let { pageNum, pageSize, articleName } = param;
    pageNum = +pageNum;
    pageSize = +pageSize;
    pageNum = pageNum - 1 >= 0 ? pageNum - 1 : 0
    console.log('param', param)
    let vital = ['pageNum', 'pageSize'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let total = await $common.getTotal('select count(*) as count from articleview where title like ?', [`%${articleName}%`]);
        console.log('total', total)
        $common.resData.data.total = total
        if (total > 0) {
            let sql = 'select * from articleview where title like ? limit ?, ?';
            let arr = [`%${articleName}%`, pageNum * pageSize, pageSize ];
            $common.db_mysql.select(sql, arr, result => {
                let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
                let resArr = $common.selectHandle(result, selectAttr);
                if (resArr.length > 0) {
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
router.get('/:id', (req, res) => {
    let param = $common.getQueryParam(req, 'params', ['id']);
    let { id } = param
    let sql = 'select * from articleview where id=?';
    let arr = [id];
    $common.db_mysql.select(sql, arr, result => {
        let selectAttr = ['id', 'categoryId', 'categoryName', 'categoryType', 'title', 'author', 'userName', 'content', 'readNum', 'recommentNum', 'likeNum', 'createTime', 'updateTime'];
        let resArr = $common.selectHandle(result, selectAttr);
        console.log('resArr', resArr)
        if (resArr.length > 0) {
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
    let param = ['categoryId', 'title', 'author'];
    param = $common.getQueryParam(req, 'body', param);
    let { categoryId, title, author } = param;
    const id = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let vital = ['categoryId', 'title', 'author'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = 'insert into articles(id, categoryId, title, author, createTime, updateTime) values(?, ?, ?, ?, ?, ?)';
        let arr = [id, categoryId, title, author, createTime, updateTime];
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
        console.log(arr)
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

module.exports = router;