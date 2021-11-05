const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();

/**
 * 角色权限授予
 * */
router.post('/', (req, res) => {
    console.log(req.body)
    const reqArr = JSON.parse(req.body.params);
    reqArr.map((reqItem, index) => {
        const id = $common.strLen()
        const roleId = reqItem.roleId;
        const rightId = reqItem.rightId;
        const createTime = new Date()
        const operator = reqItem.operator;
        let resDatas = JSON.parse(JSON.stringify($common.resData))
        let isExitRightSql = 'select * from righttorole where rightId=? and roleId=?';
        let isExitRightArr = [rightId, roleId];
        let insertRightSql =
            'insert into righttorole(id, roleId, rightId, createTime, operator) values(?, ?, ?, ?, ?)';
        let insertRightArr = [id, roleId, rightId, createTime, operator]
        $common.db_mysql.select(isExitRightSql, isExitRightArr, isExitRes => {
            if (isExitRes && isExitRes.length > 0) {
                res.send($common.setErrorData('该角色已拥有改权限，失败于第' + (index + 1) + '个授予操作'));
            } else {
                $common.db_mysql.insert(insertRightSql, insertRightArr, results => {
                    if (results) {
                        if (reqArr.length === index + 1) {
                            resDatas.data = {};
                            resDatas.msg = '角色授予权限成功';
                            res.send(resDatas);
                        }
                    } else {
                        res.send($common.setErrorData('角色授予权限失败失败于第' + (index + 1) +
                            '个授予操作'));
                    }
                })
            }
        })
    })
})
/**
 * 角色权限取消
 * */
router.delete('/', (req, res) => {
    console.log(req.query.id)
    let id = JSON.parse(req.query.id);
    console.log(id)
    let resDatas = JSON.parse(JSON.stringify($common.resData))
    id.map((idItem, index) => {
        var delRightSql = 'delete from righttorole where id=?';
        var delRightArr = [idItem];
        console.log(delRightArr)
        $common.db_mysql.del(delRightSql, delRightArr, result => {
            if (result) {
                if (id.length <= index + 1) {
                    resDatas.data = {};
                    resDatas.msg = '角色取消权限成功';
                    res.send(resDatas);
                }
            } else {
                res.send($common.setErrorData('角色取消权限失败,失败于' + (index + 1) + '个取消授权操作'));
            }
        })
    })
})
/**
 * 查看角色拥有的权限
 * */
router.get('/getRoleRight', (req, res) => {
    let param = ['pageNum', 'pageSize', 'roleId'];
    let vital = ['pageNum', 'pageSize', 'roleId'];
    let totalSql = 'select count(*) as count from rolerightview where roleId=?';
    let expand = [];
    let getSql = 'select * from rolerightview where roleId=? limit ?, ?';
    let getArr = ['roleId'];
    let selectAttr = ['id', 'roleId', 'roleName', 'roleENName', 'rightId', 'rightName', 'rightENName',
        'rightTypeName', 'operator', 'path', 'rightTypeId', 'rightStatus', 'isMenu', 'roleStatus',
        'createTime'
    ];
    let reName = ['id', 'roleId', 'roleName', 'roleENName', 'rightId', 'rightName', 'rightENName',
        'rightTypeName', 'operator', 'path', 'rightTypeId', 'rightStatus', 'isMenu', 'roleStatus',
        'createTime'
    ];
    let moduleName = '角色拥有的权限';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);

})
/**
 * 获取角色未授予的权限
 * */
router.get('/noSettingRight', (req, res) => {
    const roleId = req.query.roleId;
    let resDatas = JSON.parse(JSON.stringify($common.resData))
    let countSql = 'select count(rightId) as count from rightview';
    let getRightSql = 'select * from rightview order by updateTime';
    let getRightArr = null
    $common.db_mysql.select(countSql, null, countRes => {
        if (countRes && countRes.length > 0) {
            resDatas.total = countRes[0].count
            $common.db_mysql.select(getRightSql, getRightArr, results => {
                if (results && results.length > 0) {
                    resDatas.data = [];
                    results.map(item => {
                        let temp = {
                            rightId: item.rightId,
                            rightName: item.rightName,
                            rightENName: item.rightENName,
                            rightType: item.rightType,
                            path: item.path,
                            typeName: item.typeName,
                            createTime: item.createTime,
                            updateTime: item.updateTime
                        }
                        resDatas.data.push(temp)
                    })
                    // 获取角色拥有的权限
                    let roleRightSql = 'select * from righttorole where roleId=?'
                    let roleRightArr = [roleId]
                    $common.db_mysql.select(roleRightSql, roleRightArr, roleRightRes => {
                        if (roleRightRes && roleRightRes.length > 0) {
                            roleRightRes.map(item => {
                                let tempArr = resDatas.data
                                for(var k in tempArr) {
                                    if (tempArr[k].rightId === item.rightId) {
                                        resDatas.data.splice(k, 1)
                                        break;
                                    }
                                }
                            })
                        }
                        resDatas.msg = '获取角色未授权的权限成功';
                        res.send(resDatas)
                    })
                } else {
                    res.send($common.setErrorData('获取角色未授权的权限失败'));
                }
            })
        } else {
            resDatas.data = {data: []}
            resDatas.msg = '暂无权限数据';
            res.send(resDatas)
        }
    })
})
/**
 * 查看某个权限被授予的角色
 * */
router.get('/getRightByUser', (req, res) => {
    let param = ['pageNum', 'pageSize', 'rightId'];
    let vital = ['pageNum', 'pageSize', 'rightId'];
    let totalSql = 'select count(*) as count from rolerightview where rightId=?';
    let expand = {};
    let getSql = 'select * from rolerightview where rightId=? limit ?, ?';
    let getArr = ['rightId'];
    let selectAttr = ['id', 'roleId', 'rightId', 'operator', 'createTime', 'roleName', 'roleENName' ,'rightName', 'rightENName', 'path', 'rightTypeId', 'rightTypeName', 'rightStatus', 'isMenu', 'roleStatus'];
    let reName = ['id', 'roleId', 'rightId', 'operator', 'createTime', 'roleName', 'roleENName' ,'rightName', 'rightENName', 'path', 'rightTypeId', 'rightTypeName', 'rightStatus', 'isMenu', 'roleStatus'];
    let moduleName = '该权限被授予的角色';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
    
    
})

module.exports = router;
