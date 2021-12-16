const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
var router = $common.express.Router();

/**
 * 添加权限
 * */
router.post('/', async (req, res) => {
    const id = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let param = ['name', 'type', 'attribute'];
    let vital = ['name', 'type', 'attribute'];
    let expand = {id, createTime, updateTime};
    let insertSql = 'insert into componentmodule(id, name, typeName, attribute, createTime, updateTime) values(?, ?, ?, ?, ?, ?)';
    let insertArr = ['id', 'name', 'type', 'attribute', 'createTime', 'updateTime'];
    let moduleName = '基础组件';
    let isExitArr = ['type'];
    let exitTableName = 'basiccomponent';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName);
})
/**
 * 获取组件列表
 * */
router.get('/', (req, res) => {
    let param = ['pageNum', 'pageSize'];
    let vital = ['pageNum', 'pageSize'];
    let totalSql = 'select count(*) as count from componentmodule';
    let expand = [];
    let getSql = 'select * from componentmodule order by updateTime limit ?, ?';
    let getArr = [];
    let selectAttr = ['id', 'name', 'typeName', 'attribute',  'createTime', 'updateTime'];
    let reName = ['id', 'name', 'type', 'attribute',  'createTime', 'updateTime'];
    let moduleName = '基础组件';
    let checkBlob = true;
    let blobArr = ['attribute'];
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName, checkBlob, blobArr);
})

/**
 * 修改基础组件
 * */
router.put('/', (req, res) => {
    const updateTime = new Date();
    let param = ['id', 'name', 'typeName', 'attribute'];
    let vital = ['id', 'name', 'typeName', 'attribute'];
    let expand = { updateTime };
    let updateSql = 'update componentmodule set name=?, typeName=?, attribute=?, updateTime=? where id=?';
    let updateArr = ['name', 'typeName', 'attribute', 'updateTime', 'id'];
    let moduleName = '基础组件';
    requestHandler.putHandler(req, res, param, vital, expand, updateSql, updateArr, moduleName);
})

/**
 * 删除基础组件
 * */
router.delete('/', (req, res) => {
    let param = ['id'];
    let vital = ['id'];
    let expand = [];
    let delSql = 'delete from componentmodule where id = ?';
    let delArr = ['id'];
    let moduleName = '基础组件';
    requestHandler.delHandler(req, res, param, vital, expand, delSql, delArr, moduleName);
})

module.exports = router;