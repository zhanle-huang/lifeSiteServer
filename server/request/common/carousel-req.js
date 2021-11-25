const $common = require('../../common/common-req.js');
const requestHandler = require('../../common/request-handler.js');
var router = $common.express.Router();

router.get('/', (req, res) => {
    let param = [];
    let vital = [];
    let totalSql = 'select count(*) as count from carousel';
    let expand = [];
    let getSql = 'select * from carousel';
    let getArr = [];
    let selectAttr = ['id', 'src', 'desc', 'positionX', 'positionY', 'descWidth', 'cteateTime', 'updateTime'];
    let reName = ['id', 'src', 'desc', 'positionX', 'positionY', 'descWidth', 'cteateTime', 'updateTime'];
    let moduleName = '权限类型';
    requestHandler.getHandler(req, res, param, vital, totalSql, expand, getSql, getArr, selectAttr, reName, moduleName);
})

module.exports = router;