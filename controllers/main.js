var fs=require("fs");
var User=require("../models/user");
var async=require("async");

module.exports={
    indexPage: function(req,res){
        res.redirect("/login");
    },
    signupPage: function(req,res){
        res.render("main/signup",{message:req.flash("msg1")});
    },
    singupPost: function(req,res,next){
        if(req.body.username && req.body.fname && req.body.lname && req.body.email && req.body.gender !="-select-" && req.body.password && req.body.phone){
              User.findOne({username :req.body.username}, function(err,result){
                  if(err) return next(err);
                  if(result){
                      req.flash("msg1","User already exists");
                      res.redirect("/signup");
                      return;
                  }

                  //create respective folders first
                  async.waterfall([
                      function(callback){
                          fs.mkdir("resized_pictures/"+req.body.username,function(err){
                              if(err) return next(err);
                              var success1=1;
                              callback(null,success1);
                          });
                      },
                      function(success1,callback){
                          if(success1==1){
                              fs.mkdir("resized_pictures/"+req.body.username+"/picture1",function(err){
                                  if(err) return next(err);
                                  var success2=2;
                                  callback(null,success2);
                              });
                          }else{
                              res.json("problem creating folder");
                          }
                      },
                      function(success2,callback){
                          if(success2==2){
                              fs.mkdir("resized_pictures/"+req.body.username+"/picture2",function(err){
                                  if(err) return next(err);
                                  var success3=3;
                                  callback(null,success3);
                              });
                          }else{
                              res.json("problem 2 creating folder");
                          }
                      },
                      function(success3,callback){
                          if(success3==3){
                              fs.mkdir("uploads/"+req.body.username,function(err){
                                  if(err) return next(err);
                                  var success4=4;
                                  callback(null,success4);
                              });
                          }else{
                              res.json("problem creating folder");
                          }
                      },
                      function(success4,callback){
                          if(success4==4){
                              fs.mkdir("uploads/"+req.body.username+"/picture1",function(err){
                                  if(err) return next(err);
                                  var success5=5;
                                  callback(null,success5);
                              });
                          }else{
                              res.json("problem creating folder");
                          }
                      },
                      function(success5){
                          if(success5==5){
                              fs.mkdir("uploads/"+req.body.username+"/picture2",function(err){
                                  if(err) return next(err);

                                  //create user DB info since all folders have been created
                                  User.create({
                                      username : req.body.username,
                                      name :{
                                          fname: req.body.fname,
                                          lname: req.body.lname
                                      },
                                      email: req.body.email,
                                      sex: req.body.gender,
                                      password: req.body.password,
                                      phone: req.body.phone

                                  },function(err,user){
                                      if(err) return next(err);
                                      if(!user){
                                          req.flash("msg1","No user was created");
                                          res.redirect("/signup");
                                      }
                                      res.redirect("/login");
                                  });
                              });
                          }else{
                              res.json("problem creating folder");
                          }
                      }
                  ]);
              });

        }else{
            req.flash("msg1","All fields must be filled");
            res.redirect("/signup");
        }

    },
    loginPage: function(req,res){
        if(req.user) return res.redirect("/user/home");
        res.render("main/login",{title:"Login Page",message: req.flash("loginMessage")});
    },
    //use to test JQuery Files
    checkingPost: function(req,res){
       // var data = JSON.stringify(req.body.image);
        var clientData={
            like: req.body.like,
            unlike: req.body.unlike,
            image: req.body.image
        }
        res.json(clientData);
    },
    checkingGet: function(req,res){
        async.waterfall([
            function(callback){
                fs.mkdir("resized_pictures/pic2",function(err){
                    if(err) throw err;
                    var success=1
                    callback(null,success);
                });
            },
            function(success,callback){
                if(success==1){
                    fs.mkdir("resized_pictures/pic2/pic1",function(err){
                        if(err) throw err;
                        var success2=1
                        callback(null,success2);
                    });
                }else{
                    res.json("problem creating folder");
                }
            },
            function(success2){
                if(success2==1){
                    fs.mkdir("resized_pictures/pic2/pic3",function(err){
                        if(err) throw err;
                        res.json("All folders created successfully");
                    });
                }else{
                    res.json("problem 2 creating folder");
                }
            }
        ]);
    }
}