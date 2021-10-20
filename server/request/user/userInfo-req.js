const crypto = require('crypto');
const $common = require('../../common/common-req.js');
const router = $common.express.Router();
/**
 * 注册请求
 * */
router.post('/register', async (req, res) => {
    const phone = req.body.phone;
    const password = req.body.password;
    const name = req.body.name;
    const verification = req.body.verification;
    const token = $common.strLen();
    const createTime = new Date();
    const updateTime = new Date();
    let vital = ['phone', 'password', 'name', 'verification'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        if (await $common.isExit([phone], ['phone'], 'users')) {
            res.send($common.setErrorData('该手机号已经存在'));
        } else {
            let registerSql = 'insert into users(phone, password, name, token, createTime, updateTime) values(?, ?, ?, ?, ?, ?)';
            let registerArr = [phone, password, name, token, createTime, updateTime];
            $common.db_mysql.insert(registerSql, registerArr, (result) => {
                if (result) {
                    $common.resData.data = {};
                    $common.resData.msg = '注册成功';
                    res.send($common.resData);
                } else {
                    res.send($common.setErrorData('异常，注册失败'));
                }
            })
        }
    }
});
/**
 * 登录请求
 * */
router.post('/login', (req, res) => {
    const phone = req.body.phone;
    const password = req.body.password;
    let vital = ['phone', 'password'];
    if (!$common.vitalParam(param, vital)) {
        res.send($common.setErrorData('缺少必须参数'));
    } else {
        let loginSql = 'select * from users where phone=? and password=?';
        let loginArr = [phone, password];
        $common.db_mysql.select(loginSql, loginArr, result => {
            let resArr = $common.selectHandle(result, ['phone', 'password', 'token']);
            if (resArr.length > 0) {
                $common.resData.data.userInfo = resArr[0];
                $common.resData.msg = '登录成功';
                res.send($common.resData);
            } else {
                res.send($common.setErrorData('登录失败，账号或密码错误'));
            }
        })
    }
    
})



module.exports = router; 
 