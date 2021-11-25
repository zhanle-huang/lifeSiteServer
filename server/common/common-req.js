/**
 * 编写请求的统一代码
 * 
 * */
const express = require('express')
const db_mysql = require('../mysql/mysql.js');
const projectName = 'lifeSite';
// 引入crypto模块
const os = require('os')
const crypto = require('crypto');
let host = 'https://127.0.0.1:3001/yun/'
const noVitalParam = '缺少必须参数或参数名不对'
const platform = os.platform();
if(platform === 'linux') {
    host = 'https://zhanlehr.com:3001/yun/'
}
let cryptoObj = null;

let errorData = {
    data: null,
	status: 0,
    msg: '错误信息'
}
let resData = {
    data: {},
    msg: '',
    status: 1
}
function setErrorData(msg) {
    errorData.msg = msg
    return errorData
}
/**
 * 获取16位的随机串
 * */
function strLen() {
    var str = '';
    for(var i = 0; i<16; i++) {
        str += (Math.floor((Math.random()*15)+1)).toString(16);
    }
    return str;
}
/**
 * 加密
 * @param {String} data 加密数据
 * @param {String} password 加密的密码 
 * */
function addPWD(data, password) {
    // 加密的算法
    const algorithm = 'aes-192-cbc';
    // 使用aes192算法加密，加密的密码是st，创建一个cipher对象
    const cipher = crypto.createCipher(algorithm, password);
    //加密
    let crypted = cipher.update(data, 'utf-8', 'hex');
    // 返回加密后的数据的,final之后不能再update
    crypted += cipher.final('hex');
    cryptoObj = crypted
    return crypted;
}
console.log(addPWD('s55a6s5f4fa5s6fa', 'test1'))
/**
 * 解密
 * @param {String} data 解密数据
 * @param {String} password 解密的密码 
 * */
function enCodePWD(data, password) {
    // 加密的算法
    const algorithm = 'aes-192-cbc';
    // 使用aes192算法加密，加密的密码是st，创建一个cipher对象
    const decipher = crypto.createDecipher(algorithm, password);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    // 返回加密后的数据的,final之后不能再update
    decrypted += decipher.final('utf-8');
    return decrypted;
}

/**
 * 判断某些字段是否存在
 * @param {Array} param 参数数组
 * @param {Array} name 字段名数组
 * @return {boolean} true 表示存在，false 表示不存在
 * */
async function isExit(param, name, tableName) {
    console.log('aa', param, name)
    let isExitSql = 'select * from ' + tableName +' where ';
    let params = []
    for (var k in name) {
        params.push(param[k]);
        if (k === '0') {
            isExitSql += name[k] + '=?';
        } else {
            isExitSql += ` and ${name[k]}=?`;
        }
    }
    let data = await db_mysql.asyncSelect(isExitSql, param);
    if (data.length > 0) {
        return true
    } else {
        return false
    }
};

/**
 * 处理查询结果
 * @param {Object} result 查询结果
 * @param {Array} attrList 属性数组
 * @param {Array} reName 重命名数组
 * */
function selectHandle(result, attrList, reName = []) {
    if (result && result.length > 0) {
        let resultArr = [];
        result.map(item => {
            let obj = {};
            if (attrList.length === reName.length) {
                attrList.map((attr, index) => {
                    obj[reName[index]] = item[attr];
                })
            } else {
                attrList.map(attr => {
                    obj[attr] = item[attr];
                })
            }
            resultArr.push(obj);
        })
        return resultArr;
    } else {
        return [];
    }
}

/**
 * 获取参数
 * @param {Object} req 请求对象
 * @param {String} type 参数类型
 * @param {Array} param 参数字段数组
 * */
function getQueryParam(req, type, param) {
    let obj = {}
    param.map(item => {
        obj[item] = req[type][item] ? req[type][item] : '';
    })
    return obj;
}

/**
 * 鉴定必须存在
 * @param {Object} obj 待校验对象
 * @param {Array} param 待校验字段数组
 * */
function vitalParam(obj, param) {
    for (var k in param) {
        if (obj[param[k]] === undefined || obj[param[k]] === '') {
            return false;
        }
    }
    return true;
}

/**
 * 获取总数
 * 
 * */
async function getTotal(sql, param) {
    let data = await db_mysql.asyncSelect(sql, param);
    data = selectHandle(data, ['count']);
    return data[0].count;
}
const $common = { express, db_mysql, errorData, strLen, addPWD, enCodePWD, host, platform, resData, projectName, setErrorData, isExit, selectHandle, getQueryParam, vitalParam, getTotal, noVitalParam };
module.exports = $common

