const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();

/**
 * 用户角色授予
 * */
router.post('/', (req, res) => {
    const id = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let param = ['beUser', 'roleId', 'rightExtend', 'operator'];
    let vital = ['beUser', 'roleId', 'rightExtend', 'operator'];
    let expand = {
        id,
        createTime,
        updateTime
    };
    let insertSql =
        'insert into roletouser(id, beUser, roleId, rightExtend, opetator, createTime, updateTime) values(?, ?, ?, ?, ?, ?, ?)';
    let insertArr = ['id', 'beUser', 'roleId', 'rightExtend', 'operator', 'createTime', 'updateTime'];
    let moduleName = '授予用户角色';
    let isExitArr = ['beUser', 'roleId'];
    let exitTableName = 'roletouser';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr,
        exitTableName);
})

/**
 * 用户角色取消
 * */
router.delete('/', (req, res) => {
    let param = ['id'];
    let vital = ['id'];
    let expand = [];
    let delSql = 'delete from roletouser where id = ?';
    let delArr = ['id'];
    let moduleName = '取消用户角色';
    requestHandler.delHandler(req, res, param, vital, expand, delSql, delArr, moduleName);

})

/**
 * 查看用户拥有的角色
 * */
router.get('/getUserRole', (req, res) => {
    let param = ['pageNum', 'pageSize', 'beUser'];
    let vital = ['pageNum', 'pageSize', 'beUser'];
    let totalSql = 'select count(*) as count from roletouser where beUser=?';
    let expand = [];
    let getSql = 'select * from roleuserview where beUser=? limit ?, ?';
    let getArr = ['beUser'];
    let selectAttr = ['id', 'beUser', 'roleId', 'rightExtend', 'opetator', 'createTime', 'updateTime', 'roleName', 'roleENName', 'roleStatus', 'beUserName', 'operatorName'];
    let reName = ['id', 'beUser', 'roleId', 'rightExtend', 'operator', 'createTime', 'updateTime', 'roleName', 'roleENName', 'roleStatus', 'beUserName', 'operatorName'];
    let moduleName = '用户拥有的角色';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName,
        moduleName);

})

/**
 * 查看某个角色被授予的用户
 * */
router.get('/getRoleByUser', (req, res) => {
    let param = ['pageNum', 'pageSize', 'roleId'];
    let vital = ['pageNum', 'pageSize', 'roleId'];
    let totalSql = 'select count(*) as count from roletouser where roleId=?';
    let expand = [];
    let getSql = 'select * from roleuserview where roleId=? limit ?, ?';
    let getArr = ['roleId'];
    let selectAttr = ['id', 'beUser', 'roleId', 'rightExtend', 'opetator', 'createTime', 'updateTime', 'roleName', 'roleENName', 'roleStatus', 'beUserName', 'operatorName'];
    let reName = ['id', 'beUser', 'roleId', 'rightExtend', 'operator', 'createTime', 'updateTime', 'roleName', 'roleENName', 'roleStatus', 'beUserName', 'operatorName'];
    let moduleName = '角色被授予的用户';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})
/**
 * 获取用户未拥有的角色
 * */
router.get('/noSettingRole', (req, res) => {
    const beUser = req.query.beUser;
    let resDatas = JSON.parse(JSON.stringify($common.resData));
    resDatas.data.data = [];
    let countSql = 'select count(*) as count from roles';
    let getUserSql = 'select * from roles order by updateTime';
    let getUserArr = null;
    $common.db_mysql.select(countSql, null, countRes => {
        if (countRes && countRes.length > 0) {
            resDatas.data.total = countRes[0].count
            $common.db_mysql.select(getUserSql, getUserArr, results => {
                if (results && results.length > 0) {
                    resDatas.data.data = [];
                    results.map(item => {
                        let temp = {
                            roleId: item.roleId,
                            roleName: item.roleName,
                            roleENName: item.roleENName,
                            createTime: item.createTime,
                            updateTime: item.updateTime
                        }
                        resDatas.data.data.push(temp);
                    })
                    // 获取角色拥有的权限
                    let roleUserSql = 'select * from roletouser where beUser=?'
                    let roleUserArr = [beUser]
                    $common.db_mysql.select(roleUserSql, roleUserArr, roleUserRes => {
                        if (roleUserRes && roleUserRes.length > 0) {
                            roleUserRes.map(item => {
                                let tempArr = resDatas.data.data
                                for (var k in tempArr) {
                                    if (tempArr[k].roleId === item.roleId) {
                                        resDatas.data.data.splice(k, 1)
                                        break;
                                    }
                                }
                            })
                            resDatas.data.total = resDatas.data.data.length
                        }
                        resDatas.msg = '获取用户未授权的角色成功'
                        res.send(resDatas)
                    })
                } else {
                    res.send($common.setErrorData('获取用户未授权的角色失败'));
                }
            })
        } else {
            resDatas.data = {
                data: []
            }
            resDatas.msg = '暂无角色数据';
            res.send(resDatas)
        }
    })
})

module.exports = router;
