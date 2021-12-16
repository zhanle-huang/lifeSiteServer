const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
var router = $common.express.Router();

/**
 * 添加属性
 * */
router.post('/', async (req, res) => {
    const createTime = new Date();
    const updateTime = new Date();
    let param = ['key', 'attributeType', 'label', 'type', 'value', 'extend'];
    let vital = ['key', 'attributeType', 'label', 'type'];
    let expand = {createTime, updateTime};
    let insertSql = 'insert into basicattribute(key, attributeType, label, type, value, extend, createTime, updateTime) values(?, ?, ?, ?, ?, ?, ?, ?)';
    let insertArr = ['key', 'attributeType', 'label', 'type', 'value', 'extend', 'createTime', 'updateTime'];
    let moduleName = '基础组件属性';
    let isExitArr = ['key'];
    let exitTableName = 'basicattribute';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName);
})
/**
 * 获取组件列表
 * */
router.get('/', (req, res) => {
    let param = ['pageNum', 'pageSize'];
    let vital = ['pageNum', 'pageSize'];
    let totalSql = 'select count(*) as count from basicattributeview';
    let expand = [];
    let getSql = 'select * from basicattributeview order by updateTime limit ?, ?';
    let getArr = [];
    let selectAttr = ['key', 'attrTypeName', 'attrTypeType', 'attributeType', 'label', 'type', 'value', 'extend', 'createTime', 'updateTime'];
    let reName = ['key', 'attrTypeName', 'attrTypeType', 'attributeType', 'label', 'type', 'value', 'extendData', 'createTime', 'updateTime'];
    let moduleName = '基础组件属性';
    let checkBlob = true;
    let blobArr = ['extendData'];
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName, checkBlob, blobArr);
})

/**
 * 获取属性类型
 * */
router.get('/type', (req, res) => {
    let param = ['pageNum', 'pageSize'];
    let vital = ['pageNum', 'pageSize'];
    let totalSql = 'select count(*) as count from attributetype';
    let expand = [];
    let getSql = 'select * from attributetype order by updateTime limit ?, ?';
    let getArr = [];
    let selectAttr = ['id', 'name', 'type', 'createTime', 'updateTime'];
    let reName = ['id', 'name', 'type', 'createTime', 'updateTime'];
    let moduleName = '基础组件属性类型';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
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