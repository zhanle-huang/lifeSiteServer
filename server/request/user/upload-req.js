const crypto = require('crypto');
const $common = require('../../common/common-req.js');
const router = $common.express.Router();
const moment = require('moment');
//引入fs模块
const fs = require('fs');
const path = require('path');
//引入multer模块
const multer = require('multer');
// 设置相对路径
const desc_path = path.resolve('', path.join(__dirname, ''), '../../../public/upload');
//设置上传的文件夹, 此处存放的是上传的二进制文件
const uploadImg = multer({dest: "public/upload/"});
router.post('/image', uploadImg.any(), (req, res, next) => {
    // 文件存放路径
    let file_path = [];
    // 设置相对路径
    // let desc_path = path.resolve('', path.join(__dirname, ''), '../../../public/upload');
    for (let i = 0; i < req.files.length; i++) {
        let n = req.files[i].originalname.lastIndexOf('.');
        let type = req.files[i].originalname.substring(n);
        // 读取上传的二进制文件，并转化成指定类型
        if (/[jpeg|png|gif|jpg]$/.test(type)) {
            // 这里路径用.\会自动从跟目录开始
            let des_dress = `${desc_path}/image/${req.files[i].filename}${type}`;
            console.log(des_dress)
            let _data = null;
            try {
                _data = fs.readFileSync(req.files[i].path)
            } catch(e) {
                console.log('同步读取失败' + e);
            }
            if (_data) {
                try {
                    fs.writeFileSync(des_dress, _data)
                    file_path.push(`http://127.0.0.1:3000/lifeSite/public/upload/image/${req.files[i].filename}${type}`)
                    fs.unlinkSync(req.files[i].path)
                } catch(e) {
                    console.log('同步写入或删除失败' + e)
                }
            }
            console.log(req.files[i])
        } else {
            res.send($common.setErrorData('请上传正确的图片类型'));
        }
    }
    $common.resData.data = {
        path: file_path
    };
    $common.resData.msg = '上传图片成功';
    res.send($common.resData);
})

router.post('/demo', uploadImg.any(), (req, res, next) => {
    const userId = req.body.userId;
    // 文件存放路径
    let file_path = [];
    for (let i = 0; i < req.files.length; i++) {
        let n = req.files[i].originalname.lastIndexOf('.');
        let type = req.files[i].originalname.substring(n);
        let dataStr = moment().format('YYYYMMDD')
        // 读取上传的二进制文件，并转化成指定类型
        if (/[js|txt|html|css]$/.test(type)) {
            // 这里路径用.\会自动从跟目录开始
            let des_dress = `${desc_path}/demo/${dataStr}/${userId}/${req.files[i].originalname}`;
            console.log(des_dress)
            let _data = null;
            try {
                _data = fs.readFileSync(req.files[i].path)
            } catch(e) {
                console.log('同步读取失败' + e);
            }
            if (_data) {
                try {
                    if (!fs.existsSync(`${desc_path}/demo/${dataStr}`)) {
                        fs.mkdirSync(`${desc_path}/demo/${dataStr}`)
                        fs.mkdirSync(`${desc_path}/demo/${dataStr}/${userId}`)
                    } else {
                        if (!fs.existsSync(`${desc_path}/demo/${dataStr}/${userId}`)) {
                            fs.mkdirSync(`${desc_path}/demo/${dataStr}/${userId}`)
                        }
                    }
                    fs.writeFileSync(des_dress, _data)
                    file_path.push(`${$common.host}/public/upload/demo/${dataStr}/${userId}/${req.files[i].originalname}`)
                    fs.unlinkSync(req.files[i].path)
                } catch(e) {
                    console.log('同步写入或删除失败' + e)
                }
            }
            console.log(req.files[i])
        } else {
            res.send($common.setErrorData('请上传正确的文件类型'));
        }
    }
    $common.resData.data = {
        path: file_path
    };
    $common.resData.msg = '上传文件成功';
    res.send($common.resData);
})

router.delete('/', (req, res) => {
    let filePath = req.query.path;
    filePath = desc_path + handlerPath(filePath, '/demo');
    console.log(filePath)
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        $common.resData.data = {}
        $common.resData.msg = '删除文件成功';
        res.send($common.resData);
    } catch(e) {
        console.log(e)
    }
})
// 处理路径
function handlerPath(path, keyWord) {
    console.log(path, keyWord)
    let n = path.indexOf(keyWord);
    console.log('n', n)
    if (n > -1) {
        return path.substring(n);
    } else {
        return '';
    }
}

module.exports = router;
