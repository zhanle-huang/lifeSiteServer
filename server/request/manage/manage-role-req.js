const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();

/**
 * 添加角色
 * */
router.post('/', (req, res) => {
    const roleId = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let param = ['roleName', 'roleENName'];
    let vital = ['roleName', 'roleENName'];
    let expand = {roleId, createTime, updateTime};
    let insertSql = 'insert into roles(roleId, roleName, roleENName, createTime, updateTime) values(?, ?, ?, ?, ?)';
    let insertArr = ['roleId', 'roleName', 'roleENName', 'createTime', 'updateTime'];
    let moduleName = '角色';
    let isExitArr = ['roleName'];
    let exitTableName = 'roles';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName);
})

/**
 * 删除角色
 * */
router.delete('/', (req, res) => {
    let param = ['roleId'];
    let vital = ['roleId'];
    let expand = [];
    let delSql = 'delete from roles where roleId=?';
    let delArr = ['roleId'];
    let moduleName = '权限';
    requestHandler.delHandler(req, res, param, vital, expand, delSql, delArr, moduleName);
})
/**
 * 获取角色
 * */
router.get('/', (req, res) => {
    let param = ['pageNum', 'pageSize'];
    let vital = ['pageNum', 'pageSize'];
    let totalSql = 'select count(roleId) as count from roles';
    let expand = [];
    let getSql = 'select * from roles order by updateTime limit ?, ?';
    let getArr = [];
    let selectAttr = ['roleId', 'roleName', 'roleENName', 'status', 'createTime', 'updateTime'];
    let reName = ['roleId', 'roleName', 'roleENName', 'status', 'createTime', 'updateTime'];
    let moduleName = '角色';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})

/**
 * 修改角色
 * */
router.put('/', (req, res) => {
    const roleId = $common.strLen();
    const updateTime = new Date();
    let param = ['roleId', 'roleName', 'roleENName', 'status'];
    let vital = ['roleId', 'roleName', 'roleENName', 'status'];
    let expand = { updateTime };
    let updateSql = 'update roles set roleName=?, roleENName=?, status=?, updateTime=? where roleId=?';
    let updateArr = ['roleName', 'roleENName', 'status', 'updateTime', 'roleId'];
    let moduleName = '角色';
    requestHandler.putHandler(req, res, param, vital, expand, updateSql, updateArr, moduleName);
})

/**
 * 查询角色信息
 * */
router.get('/searchRole', (req, res) => {
    let param = ['pageNum', 'pageSize', 'keyWord'];
    let vital = ['pageNum', 'pageSize', 'keyWord'];
    let totalSql = 'select count(*) as count from roles where roleName like ? or roleENName like ?';
    let expand = {roleName: `%${req.query.keyWord}%`, roleENName: `%${req.query.keyWord}%`};
    let getSql = 'select * from roles where roleName like ? or roleENName like ? limit ?, ?';
    let getArr = ['roleName', 'roleENName'];
    let selectAttr = ['roleId', 'roleName', 'roleENName', 'status', 'createTime', 'updateTime'];
    let reName = ['roleId', 'roleName', 'roleENName', 'status', 'createTime', 'updateTime'];
    let moduleName = '角色';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})

module.exports = router;
