//引入mysql
var mysql = require('mysql');
const os = require('os')
//创建连接
var platform = os.platform();
let connection = null;
if (platform === 'linux') {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '07300228Hl',
        database: 'lifesite'
    });
} else {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'lifesite'
    });
}


//连接
connection.connect(err => {
    if (!err) {
        console.log("connect success")
        return;
    }
    console.log('error connecting;' + err.stack);
});
var d_mysql = {};
d_mysql.select = function(sql, param, callback) { //更新成功返回true，否则返回错误
    try {
        connection.query(sql, param, function(error, results, fields) {
            if (error) {
                console.log(error);
                callback && callback(null)
                throw error;
            }
            callback && callback(results)
        });
    } catch {
        console.log('数据库查询操作错误')
    }
}
//同步查询
d_mysql.asyncSelect = function(sql, param) {
    return new Promise((resolve, reject) => {
        connection.query(sql, param, function(error, results, fields) {
            console.log(error)
            if (error) {
                reject(false);
                return;
            }
            console.log('results', results)
            // console.log('The solution is: ', results);
            // console.log('The solution is: ', results[0].userId);
            resolve(results);
        });
    })
}
//同步插入
d_mysql.asyncInsert = function(sql, param) {
    return new Promise((resolve, reject) => {
        connection.query(sql, param, (error, results, fields) => {
            if (error) {
                reject(false);
            }
            // console.log('insert is success');
            console.log(results)
            if (!!results && results.affectedRows >= 1) {
                resolve(true);
            } else {
                reject(false);
            }
        })
    })
}
//异步插入
d_mysql.insert = function(sql, param, callback) {
    try {
        connection.query(sql, param, (error, results, fields) => {
            console.log('xx', results)
            if (error) {
                callback && callback(false)
                throw error;
            }
            if (!!results && results.affectedRows >= 1) {
                callback && callback(true);
            } else {
                callback && callback(false)
            }
        })
    } catch {
        console.log('数据库插入操作错误');
    }
}
//同步更新
d_mysql.asyncUpdate = function(sql, param) {
    return new Promise((resolve, reject) => {
        connection.query(sql, param, function(error, results, fields) {
            if (error) {
                reject(false);
            }
            // console.log('The solution is: ', results);
            // console.log('The solution is: ', results[0].userId);
            if (!!results && results.affectedRows >= 1) {
                resolve(true);
            } else {
                resolve(true);
            }
        });
    })
}
//更新成功返回true，否则返回错误
d_mysql.update = function(sql, param, callback) {
    try {
        connection.query(sql, param, function(error, results, fields) {
            console.log(results)
            if (error) {
                callback && callback(false)
                throw error;
            }
            if (!!results && results.affectedRows >= 1) {
                callback && callback(true);
            } else {
                callback && callback(false)
            }
        });
    } catch {
        console.log('数据库更新操作错误')
    }
}

d_mysql.del = function(sql, param, callback) { //删除成功返回true，否则返回错误
    try {
        connection.query(sql, param, function(error, results, fields) {
            console.log(results)
            if (error) {
                callback && callback(false)
                throw error;
            }
            // console.log('The solution is: ', results);
            // console.log('The solution is: ', results[0].userId);
            if (!!results && results.affectedRows >= 1) {
                callback && callback(true);
            } else {
                callback && callback(false)
            }
        });
    } catch {
        console.log("数据库删除操作错误");
    }
}

d_mysql.close = function() {
    connection.end(function(err) {
        console.log(err)
    });
}

module.exports = d_mysql;
