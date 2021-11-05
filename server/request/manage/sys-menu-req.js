const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();


/**
 * 添加菜单
 * */
router.post('/addSysMenu', (req, res) => {
    const id = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let param = ['parentId', 'name', 'ENName', 'path', 'icon', 'isDisabled', 'isSystem'];
    let vital = [ 'name', 'ENName', 'path'];
    let expand = {id, createTime, updateTime};
    let insertSql = 'insert into sysmenu(id, parentId, name, ENName, path, icon, isDisabled, isSystem, createTime, updateTime) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let insertArr = ['id', 'parentId', 'name', 'ENName', 'path', 'icon', 'isDisabled', 'isSystem', 'createTime', 'updateTime'];
    let moduleName = '菜单';
    let isExitArr = ['path'];
    let exitTableName = 'sysmenu';
    requestHandler.postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName, menuRight(name, ENName, path));
    
    
    // const id = $common.strLen();
    // const parentId = req.body.parentId;
    // const name = req.body.name;
    // const ENName = req.body.ENName;
    // const layer = parseInt(req.body.layer);
    // const path = req.body.path;
    // const icon = req.body.icon;
    // const isDisabled = req.body.isDisabled ? '1' : '0';
    // const isSystem = req.body.isSystem ? '1' : '0';
    // const createTime = new Date();
    // const updateTime = new Date();
    // let resDatas = JSON.parse(JSON.stringify(resData))
    // let insertSql =
    //     'insert into sysmenu(id, parentId, name, ENName, layer, path, icon, isDisabled, isSystem, createTime, updateTime) values(?,?,?,?,?,?,?,?,?,?,?)';
    // let insertArr = [id, parentId, name, ENName, layer, path, icon, isDisabled, isSystem, createTime,
    //     updateTime
    // ];
    // let isExitSql = 'select * from sysmenu where path=?';
    // let isExitArr = [path];
    // db_mysql.select(isExitSql, isExitArr, isExitRes => {
    //     if (isExitRes && isExitRes.length > 0) {
    //         errorData.msg = '该菜单路径重复';
    //         res.send(errorData)
    //     } else {
    //         db_mysql.insert(insertSql, insertArr, results => {
    //             if (results) {
    //                 menuRight(name, ENName, path)
    //                 resDatas.msg = '添加系统菜单成功';
    //                 res.send(resDatas)
    //             } else {
    //                 errorData.msg = '添加系统菜单失败';
    //                 errorData.code = 201;
    //                 res.send(errorData)
    //             }
    //         })
    //     }
    // })
})
// 根据添加的菜单添加权限
async function menuRight(name, ENName, menuPath) {
    const rightId = $common.strLen();
    const rightName = name;
    const rightENName = ENName;
    const rightTypeId = await getMenuTypeId();
    const path = menuPath;
    const createTime = new Date();
    const updateTime = new Date();
    let insertSql =
        'insert into rights(rightId, rightName, rightENName, rightTypeId, path, createTime, updateTime) values(?, ?, ?, ?, ?, ?, ?)'
    let insertArr = [rightId, rightName, rightENName, rightType, path, createTime, updateTime];
    $common.db_mysql.select(insertSql, insertArr, results => {
        if (results) {
            console.log('添加菜单权限成功')
        } else {
            console.log('添加菜单权限失败')
        }
    })
}

// 获取权限类型为菜单的id
async function getMenuTypeId() {
    let rightTypeSql = 'select * from righttype';
    let results = await $common.db_mysql.asyncSelect(rightTypeSql, null)
    if (results && results.length > 0) {
        for (let key of results) {
            if (key.isMenu === '1') {
                return key.id
            }
        }
    }
}
// 根据菜单修改修改权限
async function modifyRight(rId, rName, rENName, rPath) {
    const rightId = rId;
    const rightName = rName;
    const rightENName = rENName;
    const path = rPath;
    const updateTime = new Date();
    let resDatas = JSON.parse(JSON.stringify($common.resData))
    let updateSql = 'update rights set rightName=?, rightENName=?, path=?, updateTime=? where rightId=?';
    let updateArr = [rightName, rightENName, path, updateTime, rightId];
    await $common.db_mysql.update(updateSql, updateArr, results => {
        console.log('修改菜单权限成功')
    })
}
/**
 * 根据权限获取用户菜单
 * */
router.post('/getMenuByRight', async (req, res) => {
    const beUser = req.body.beUser;
    let getRightSql = 'select * from userstorightview where isMenu=1 and beUser=?';
    let getRightArr = [beUser];
    let resDatas = JSON.parse(JSON.stringify($common.resData));
    // 获取用户菜单的权限
    let getRightResult = await $common.db_mysql.asyncSelect(getRightSql, getRightArr);
    if (getRightResult && getRightResult.length > 0) {
        let tempMenu = []
        getRightResult.map(item => {
            let menu = {
                path: item.path
            }
            tempMenu.push(menu)
        })
        let menuResult = [];
        let menuIdArr = []
        for (var item of tempMenu) {
            let getMenuSql = 'select * from sysmenu where path=?';
            let getMenuArr = [item.path];
            // 遍历用户菜单的权限，获取相应的菜单
            let menuResults = await $common.db_mysql.asyncSelect(getMenuSql, getMenuArr)
            if (menuResults && menuResults.length > 0) {
                menuResult.push(menuResults[0])
                menuIdArr.push(menuResults[0].id)
            }
        }
        for (var menu of menuResult) {
            await getParentMenu(menu, menuIdArr, menuResult)
        }
        if (menuResult.length > 0) {
            menuResult.map(item => {
                item.children = [];
            })
            let resd = menuHandle(menuResult);
            resd = createRouter(resd)
            resDatas.data = resd
            resDatas.msg = '获取系统菜单成功';
            res.send(resDatas);
        } else {
            resDatas.data = []
            resDatas.msg = '暂无系统菜单';
            res.send(resDatas);
        }
    } else {
        resDatas.data = []
        resDatas.msg = '暂无系统菜单权限';
        res.send(resDatas);
    }
})

/**
 * 获取该节点的父类，并且是未获取过的
 * */
async function getParentMenu(obj, arr, menuResult) {
    if (obj.parentId && arr.indexOf(obj.parentId) === -1) {
        let getMenuSql = 'select * from sysmenu where id=?';
        let getMenuArr = [obj.parentId];
        let results = await $common.db_mysql.asyncSelect(getMenuSql, getMenuArr)
        if (results && results.length > 0) {
            menuResult.push(results[0])
            arr.push(results[0].id)
            await getParentMenu(results[0], arr, menuResult)
        }
    }
}

/**
 * 获取系统菜单
 * */
router.get('/getSysMenu', (req, res) => {
    const menuFlag = req.query.menuFlag === 'true';
    let getMenuSql = menuFlag ? 'select * from sysmenu  where isDelete=0' : 'select * from sysmenu';
    let resDatas = JSON.parse(JSON.stringify($common.resData));
    $common.db_mysql.select(getMenuSql, null, results => {
        let data = [];
        if (results && results.length > 0) {
            results.map(item => {
                item.children = [];
            })
            let resd = menuHandle(results);
            resd = menuFlag ? createRouter(resd) : resd
            resDatas.data = resd
            resDatas.msg = '获取系统菜单成功';
            res.send(resDatas);
        } else {
            resDatas.data = []
            resDatas.msg = '暂无系统菜单';
            res.send(resDatas);
        }
    })
})

/**
 * 将结果处理成菜单
 * */
function createRouter(menuArr) {
    return menuArr.reduce((prev, cur, index) => {
        let temp = {
            id: cur.id,
            name: cur.path,
            path: cur.path,
            component: cur.path,
            isDisabled: cur.isDisabled === '1',
            isSystem: cur.isSystem === '1',
            meta: {
                title: cur.name,
                icon: cur.icon
            },
            children: cur.children.length > 0 ? createRouter(cur.children) : []
        }
        prev.push(temp)
        return prev;
    }, [])
}
/**
 * 查找id
 * */
function foundId(arr, curItem) {
    arr.map(arrItem => {
        if (arrItem.id === curItem.parentId) { // 如果是这个对象的子集
            // 就添加进去
            arrItem.children.push(curItem);
            // 查找到就去除当前位置
            return;
        } else { // 否则进入他的子集中继续寻找，直到没有
            if (arrItem.children.length > 0) {
                foundId(arrItem.children, curItem);
            }
        }
    })
}
/**
 * 将数据库查询出来的数据处理成树形结构
 * */
function menuHandle(results) {
    for (let i = 0, j = results.length - 1; i <= j; j--) {
        // 获取第一个元素
        let cur = results.shift();
        if (cur.parentId) {
            foundId(results, cur);
        } else {
            results.push(cur)
        }
    }
    return results;
}
/**
 * 菜单是否存在重复中文名称，英文名称，路径
 * */
router.get('/isExitMenu', (req, res) => {
    const keyWord = req.query.keyWord;
    let isExitSql = 'select * from sysmenu where path=?';
    let isExitArr = [keyWord, keyWord, keyWord];
    let resDatas = JSON.parse(JSON.stringify($common.resData))
    $common.db_mysql.select(isExitSql, isExitArr, isExitRes => {
        if (isExitRes && isExitRes.length > 0) {
            errorData.msg = keyWord + '：该菜单路径重复';
            res.send(errorData)
        } else {
            resDatas.msg = '可以使用该属性'
            resDatas.code = 200;
            res.send(resDatas)
        }
    })
})

/**
 * 修改系统菜单
 * */
router.post('/modifySysMenu', async (req, res) => {
    const id = req.body.id;
    const parentId = req.body.parentId;
    const name = req.body.name;
    const ENName = req.body.ENName;
    const path = req.body.path;
    const icon = req.body.icon;
    const isDisabled = req.body.isDisabled === 'true' ? '1' : '0';
    const isSystem = req.body.isSystem === 'true' ? '1' : '0';
    const isDelete = req.body.isDelete === 'true' ? '1' : '0';
    const updateTime = new Date();
    const prevPath = await getMenuById(id)
    let resDatas = JSON.parse(JSON.stringify($common.resData))
    let modifyMenuSql =
        'update sysmenu set parentId=?,name=?,ENName=?,path=?,icon=?,isDisabled=?,isSystem=?,isDelete=?,updateTime=? where id=?';
    let modifyMenuArr = [parentId, name, ENName, path, icon, isDisabled, isSystem, isDelete,
        updateTime, id
    ];
    $common.db_mysql.update(modifyMenuSql, modifyMenuArr, async modifyMenuRes => {
        if (!!modifyMenuRes && modifyMenuRes.affectedRows === 1) {
            let rightItem = await getRightId(prevPath.path)
            modifyRight(rightItem.rightId, name, ENName, path)
            resDatas.msg = '修改系统菜单成功';
            res.send(resDatas)
        } else {
            errorData.msg = '修改系统菜单失败';
            errorData.code = 201;
            res.send(errorData)
        }
    })
})
// 根据菜单的路径和名称还有类型获取权限id
async function getRightId(path) {
    const rightPath = path;
    let getIdSql = 'select * from rightsview where isMenu=1 and path=?';
    let getIdArr = [rightPath]
    let result = await $common.db_mysql.asyncSelect(getIdSql, getIdArr);
    if (result && result.length > 0) {
        return result[0]
    } else {
        return ''
    }
}

/**
 * 删除系统菜单
 * */
router.get('/delMenu', async (req, res) => {
    const id = req.query.id;
    let delMenuSql = 'delete from sysmenu where id=?';
    let delMenuArr = [id]
    let resDatas = JSON.parse(JSON.stringify($common.resData))
    let menuPath = await getMenuById(id)
    $common.db_mysql.del(delMenuSql, delMenuArr, async (result) => {
        if (result) {
            let rightItem = await getRightId(menuPath.path)
            delMenuRight(rightItem.rightId)
            resDatas.msg = '删除菜单成功';
            res.send(resDatas)
        } else {
            res.send($common.setErrorData('删除菜单失败'));
        }
    })
})

// 根据id获取菜单
async function getMenuById(id) {
    const menuId = id;
    let getMenuSql = 'select * from sysmenu where id=?';
    let getMenuArr = [menuId];
    let results = await $common.db_mysql.asyncSelect(getMenuSql, getMenuArr);
    if (results && results.length > 0) {
        return results[0];
    } else {
        return '';
    }
}
// 根据id删除菜单权限
function delMenuRight(id) {
    let resDatas = JSON.parse(JSON.stringify(resData))
    let delRightSql = 'delete from rights where rightId = ?';
    let delRightArr = [id];
    $common.db_mysql.del(delRightSql, delRightArr, result => {
        if (result) {
            console.log('删除权限成功')
        } else {
            console.log('删除权限失败')
        }
    })
}

/**
 * 搜索菜单
 * */
router.get('/searchMenu', (req, res) => {
    let param = ['pageNum', 'pageSize', 'keyWord'];
    let vital = ['pageNum', 'pageSize', 'keyWord'];
    let totalSql = 'select count(*) as count from sysmenu where name like ? or path like ?';
    let expand = {name: `%${req.query.keyWord}%`, path: `%${req.query.keyWord}%`};
    let getSql = 'select * from sysmenu where name like ? or path like ? limit ?, ?';
    let getArr = ['name', 'path'];
    let selectAttr = ['id', 'parentId', 'name', 'ENName', 'path', 'icon', 'isDisabled', 'isSystem', 'isDelete', 'createTime', 'updateTime'];
    let reName = ['id', 'parentId', 'name', 'ENName', 'path', 'icon', 'isDisabled', 'isSystem', 'isDelete', 'createTime', 'updateTime'];
    let moduleName = '菜单';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
    
    // const keyWord = `%${req.query.keyWord}%`
    // const pageNum = parseInt(req.query.pageNum) - 1 >= 0 ? parseInt(req.query.pageNum) - 1 : 0;
    // const pageSize = parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 10;
    // let resDatas = JSON.parse(JSON.stringify(resData))
    // let countSql = 'select count(*) as count from sysmenu where name like ? or path like ?';
    // let countArr = [keyWord, keyWord]
    // let getMenuSql = 'select * from sysmenu where name like ? or path like ? limit ?, ?';
    // let getMenuArr = [keyWord, keyWord, pageNum * pageSize, pageSize]
    // db_mysql.select(countSql, countArr, countRes => {
    //     if (countRes && countRes.length > 0) {
    //         resDatas.total = countRes[0].count
    //         db_mysql.select(getMenuSql, getMenuArr, results => {
    //             console.log(results)
    //             if (results && results.length > 0) {
    //                 resDatas.data = [];
    //                 results.map(item => {
    //                     let temp = {
    //                         id: item.id,
    //                         parentId: item.parentId,
    //                         name: item.name,
    //                         ENName: item.ENName,
    //                         path: item.path,
    //                         icon: item.icon,
    //                         isDisabled: item.isDisabled,
    //                         isSystem: item.isSystem,
    //                         isDelete: item.isDelete
    //                     }
    //                     resDatas.data.push(temp)
    //                 })
    //                 resDatas.msg = '查询菜单成功'
    //                 res.send(resDatas)
    //             } else {
    //                 errorData.msg = '查询菜单失败';
    //                 errorData.code = 201;
    //                 res.send(errorData)
    //             }
    //         })
    //     } else {
    //         resDatas.data = []
    //         resDatas.msg = '暂无相关菜单数据';
    //         res.send(resDatas)
    //     }
    // })
})

/**
 * 获取未成为权限的菜单
 * */
router.get('/getNoRightMenu', async (req, res) => {
    let rightResult = await getMenuIsRight();
    let menus = await getMenu();
    if (!menus || menus.length === 0) {
        errorData.msg = '获取菜单菜单失败'
        res.send(errorData)
        return;
    }
    let resDatas = JSON.parse(JSON.stringify($common.resData))
    menus.map(item => {
        if (rightResult[0].indexOf(item.path) === -1) {
            resDatas.data.push({
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                ENName: item.ENName,
                layer: item.layer,
                path: item.path,
                icon: item.icon,
                isDisabled: item.isDisabled,
                isSystem: item.isSystem,
                isDelete: item.isDelete
            })
        }
    })
    resDatas.msg = '获取未成为权限菜单成功'
    res.send(resDatas)
})
// 获取已经成为权限的菜单的路径
async function getMenuIsRight() {
    let getMenuRightSql = 'select * from rightsview where isMenu=1';
    let getMenuRightArr = null
    let paths = []
    let names = []
    // 获取已经成为权限的菜单的路径
    let getMenuRightRes = await $common.db_mysql.asyncSelect(getMenuRightSql, getMenuRightArr)
    if (getMenuRightRes && getMenuRightRes.length > 0) {
        getMenuRightRes.map(item => {
            paths.push(item.path)
            names.push(item.rightName)
        })
    }
    return [paths, names]
}
// 获取菜单
async function getMenu() {
    let getMenuSql = 'select * from sysmenu';
    let menus = []
    // 获取已经成为权限的菜单的路径
    let getMenuRes = await $common.db_mysql.asyncSelect(getMenuSql, null)
    if (getMenuRes && getMenuRes.length > 0) {
        getMenuRes.map(item => {
            let temp = {
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                ENName: item.ENName,
                layer: item.layer,
                path: item.path,
                icon: item.icon,
                isDisabled: item.isDisabled,
                isSystem: item.isSystem,
                isDelete: item.isDelete
            }
            menus.push(temp)
        })
        return menus
    } else {
        return []
    }
}

module.exports = router;
