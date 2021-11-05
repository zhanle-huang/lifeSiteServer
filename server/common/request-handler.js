const $common = require('./common-req.js');
/**
 * @param { Object } req 请求对象
 * @param { Object } res 响应对象
 * @param { Array } param 要传递的参数名称
 * @param { Array } vital 必传参数字段名
 * @param { String } totalSql 获取总数的sql
 * @param { Array } expand 额外的判断参数,不方便直接获取的
 * @param { String } getSql 获取数据sql
 * @param { Array } getArr 查询参数
 * @param { Array } selectAttr 查询字段
 * @param { Array } reName 重命名字段
 * @param { String } moduleName 模块名
 * */


async function getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName) {
    if (param.length >= 0) {
        param = $common.getQueryParam(req, 'query', param);
        param.pageNum = +param.pageNum;
        param.pageSize = (+param.pageSize) > 0 ? +param.pageSize : 10;
        param.pageNum = param.pageNum - 1 >= 0 ? param.pageNum - 1 : 0;
    }
    console.log(param, vital)
    if (vital.length > 0 && !$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let arr = [];
        let keys = Object.keys(param);
        getArr.map(item => {
            if (keys.indexOf(item) > -1) {
                arr.push(param[item])
            } else {
                arr.push(expand[item])
            }
        })
        let total = await $common.getTotal(totalSql, arr);
        $common.resData.data.total = total
        console.log(total)
        if (total > 0) {
            let sql = getSql;
            arr = [...arr, param.pageNum, param.pageSize];
            $common.db_mysql.select(sql, arr, result => {
                let resArr = $common.selectHandle(result, selectAttr, reName);
                if (resArr.length > 0) {
                    $common.resData.data.list = resArr;
                    $common.resData.msg = `获取${moduleName}成功`;
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData(`获取${moduleName}失败`));
                }
            })
        } else {
            $common.resData.data.list = [];
            $common.resData.msg = `获取${moduleName}成功`;
            res.send($common.resData);
        }
    }
}
/**
 * @param { Object } req 请求对象
 * @param { Object } res 响应对象
 * @param { Array } param 要传递的参数名称
 * @param { Array } vital 必传参数字段名
 * @param { Array } expand 额外的参数
 * @param { String } insertSql 获取数据sql
 * @param { Array } insertArr 插入的值
 * @param { String } moduleName 模块名
 * @param { Array } isExitArr 监测是否存在字段名
 * @param { String } exitTableName 监测是否存在表名
 * */
async function postHandler(req, res, param, vital, expand, insertSql, insertArr, moduleName, isExitArr, exitTableName, callback) {
    if (param.length >= 0) {
        param = $common.getQueryParam(req, 'body', param);
    }
    if (vital.length > 0 && !$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let exitArr = [];
        isExitArr.map(item => {
            exitArr.push(param[item])
        })
        if (isExitArr.length > 0 && await $common.isExit(exitArr, isExitArr, exitTableName)) {
            res.send($common.setErrorData(`该${moduleName}已存在`));
            return;
        }
        let sql = insertSql;
        let arr = [];
        let keys = Object.keys(param);
        insertArr.map(item => {
            if (keys.indexOf(item) > -1) {
                arr.push(param[item])
            } else {
                arr.push(expand[item])
            }
        })
        $common.db_mysql.insert(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = `添加${moduleName}成功`;
                callback && callback();
                res.send($common.resData);
            } else {
                res.send($common.setErrorData(`添加${moduleName}失败`));
            }
        })
    }
}
/**
 * @param { Object } req 请求对象
 * @param { Object } res 响应对象
 * @param { Array } param 要传递的参数名称
 * @param { Array } vital 必传参数字段名
 * @param { Array } expand 额外的参数
 * @param { String } delSql 删除数据sql
 * @param { Array } delArr 删除的值
 * @param { String } moduleName 模块名
 * */
async function delHandler(req, res, param, vital, expand, delSql, delArr, moduleName) {
    if (param.length >= 0) {
        param = $common.getQueryParam(req, 'query', param);
    }
    if (vital.length > 0 && !$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = delSql;
        let arr = [];
        let keys = Object.keys(param);
        delArr.map(item => {
            if (keys.indexOf(item) > -1) {
                arr.push(param[item])
            } else {
                arr.push(expand[item])
            }
        })
        $common.db_mysql.del(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = `删除${moduleName}成功`;
                res.send($common.resData);
            } else {
                res.send($common.setErrorData(`删除${moduleName}失败`));
            }
        })
    }
}
/**
 * @param { Object } req 请求对象
 * @param { Object } res 响应对象
 * @param { Array } param 要传递的参数名称
 * @param { Array } vital 必传参数字段名
 * @param { Array } expand 额外的参数
 * @param { String } updateSql 更新数据sql
 * @param { Array } updateArr 更新的值
 * @param { String } moduleName 模块名
 * */
function putHandler(req, res, param, vital, expand, updateSql, updateArr, moduleName) {
    if (param.length >= 0) {
        param = $common.getQueryParam(req, 'body', param);
    }
    console.log(param, vital)
    if (vital.length > 0 && !$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let sql = updateSql;
        let arr = [];
        let keys = Object.keys(param);
        updateArr.map(item => {
            if (keys.indexOf(item) > -1) {
                arr.push(param[item])
            } else {
                arr.push(expand[item])
            }
        })
        $common.db_mysql.update(sql, arr, result => {
            if (result) {
                $common.resData.data = {};
                $common.resData.msg = `修改${moduleName}成功`;
                res.send($common.resData);
            } else {
                res.send($common.setErrorData(`修改${moduleName}失败`));
            }
        })
    }
}

module.exports = {
    getHandler,
    postHandler,
    putHandler,
    delHandler
}