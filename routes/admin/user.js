
var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var md5=require('md5-node'); /*md5加密*/
var DB=require('../../modules/db.js');  /*引入DB数据库*/

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

router.get('/',function(req,res){
    //res.send('显示用户首页');
    DB.find('user',{},function(err,data){

        res.render('admin/user/index',{
            list:data
        });
    })



})
//处理登录的业务逻辑
router.get('/add',function(req,res){
    res.render('admin/user/add');

})

//添加用户
router.post('/doAdd',function(req,res){

    var username=req.body.username;
    var password=md5(req.body.password);  /*要对用户输入的密码加密*/
    var status=req.body.status;

    DB.insert('user',{
        username:username,
        password:password,
        status:status
    },function(err,data){
        if(!err){
            res.redirect('/admin/user');
        }
    })

})

// 更新
router.get('/edit',function(req,res){

    //获取get传值 id

    var id=req.query.id;

    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)

    DB.find('user',{"_id":new DB.ObjectID(id)},function(err,data){

        // console.log(data);

        res.render('admin/user/edit',{
            list:data[0]
        });
    });

})

// 提交更新
router.post('/doEdit',function(req,res){

    var _id=req.body._id;   /*修改的条件*/
    var setData = {
        username:req.body.username,
        status:req.body.status
    };

    DB.update('user',{"_id":new DB.ObjectID(_id)},setData,function(err,data){
        if(!err){
            res.redirect('/admin/user');
        }
    })

});

router.get('/delete',function(req,res){
    //获取id

    var  id=req.query.id;

    DB.deleteOne('user',{"_id":new DB.ObjectID(id)},function(err){

        if(!err){

            res.redirect('/admin/user');
        }

    })

})

module.exports = router;   /*暴露这个 router模块*/