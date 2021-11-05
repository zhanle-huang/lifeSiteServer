const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();

/**
 * 添加权限
 * */
router.post('/', async (req, res) => {
    const rightId = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let param = ['rightName', 'rightENName', 'rightTypeId', 'path'];
    let vital = ['rightName', 'rightENName', 'rightTypeId', 'path'];
    let expand = {rightId, createTime, updateTime};
    let insertSql = 'insert into rights(rightId, rightName, rightENName, rightTypeId, path, createTime, updateTime) values(?, ?, ?, ?, ?, ?, ?)';
    let insertArr = ['rightId', 'rightName', 'rightENName', 'rightTypeId', 'path', 'createTime', 'updateTime'];
    let moduleName = '权限';
    let isExitArr = ['path'];
    let exitTableName = 'rights';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName);
})

/**
 * 获取权限类型
 * */
router.get('/getRightType', async (req, res) => {
    let param = [];
    let vital = [];
    let totalSql = 'select count(*) as count from righttype';
    let expand = [];
    let getSql = 'select * from righttype';
    let getArr = [];
    let selectAttr = ['id', 'name', 'isMenu'];
    let reName = ['id', 'typeName', 'isMenu'];
    let moduleName = '权限类型';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})
/**
 * 删除权限
 * */
router.delete('/', (req, res) => {
    let param = ['rightId'];
    let vital = ['rightId'];
    let expand = [];
    let delSql = 'delete from rights where rightId = ?';
    let delArr = ['rightId'];
    let moduleName = '权限';
    requestHandler.delHandler(req, res, param, vital, expand, delSql, delArr, moduleName);
})
/**
 * 获取权限
 * */
router.get('/', (req, res) => {
    let param = ['pageNum', 'pageSize'];
    let vital = ['pageNum', 'pageSize'];
    let totalSql = 'select count(rightId) as count from rightview';
    let expand = [];
    let getSql = 'select * from rightview order by updateTime limit ?, ?';
    let getArr = [];
    let selectAttr = ['rightId', 'rightName', 'rightENName', 'rightTypeId', 'typeName', 'path', 'status', 'isMenu', 'createTime', 'updateTime'];
    let reName = ['rightId', 'rightName', 'rightENName', 'rightType', 'typeName', 'path', 'status', 'isMenu', 'createTime', 'updateTime'];
    let moduleName = '权限';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})
/**
 * 修改权限
 * */
router.put('/', (req, res) => {
    const rightId = $common.strLen();
    const updateTime = new Date();
    let param = ['rightId', 'rightName', 'rightENName', 'rightTypeId', 'path', 'status'];
    let vital = ['rightId', 'rightName', 'rightENName', 'rightTypeId', 'path', 'status'];
    let expand = { updateTime };
    let updateSql = 'update rights set rightName=?, rightENName=?, rightTypeId=?, path=?, status=?, updateTime=? where rightId=?';
    let updateArr = ['rightName', 'rightENName', 'rightTypeId', 'path', 'status', 'updateTime', 'rightId'];
    let moduleName = '权限';
    requestHandler.putHandler(req, res, param, vital, expand, updateSql, updateArr, moduleName);
})

// /**
//  * 查询权限信息
//  * */
router.get('/searchRight', (req, res) => {
    let param = ['pageNum', 'pageSize', 'keyWord'];
    let vital = ['pageNum', 'pageSize', 'keyWord'];
    let totalSql = 'select count(*) as count from rightview where rightName like ? or rightENName like ? or typeName like ? or path like ?';
    let expand = {rightENName: `%${req.query.keyWord}%`, rightName: `%${req.query.keyWord}%`, typeName: `%${req.query.keyWord}%`, path: `%${req.query.keyWord}%`};
    let getSql = 'select * from rightview where rightName like ? or rightENName like ? or typeName like ? or path like ? limit ?, ?';
    let getArr = ['rightName', 'rightENName', 'typeName', 'path'];
    let selectAttr = ['rightId', 'rightName', 'rightENName', 'typeName', 'typeName', 'path', 'status', 'isMenu', 'createTime', 'updateTime'];
    let reName = ['rightId', 'rightName', 'rightENName', 'rightType', 'typeName', 'path', 'status', 'isMenu', 'createTime', 'updateTime'];
    let moduleName = '权限';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})

module.exports = router;