var model=require("../../model.js"),pageSize=model.db.config.pageSize,crypto=require("crypto"),auth=require("./auth.js"),User=model.ws_user;module.exports=function(e){e.get("/",function(e,t){t.render("Client/index.html",{user:e.session.user,websiteTitle:model.db.config.websiteTitle,search:e.query.q})}),e.get("/login",function(e,t){t.render("Client/login.html",{websiteTitle:model.db.config.websiteTitle})}),e.get("/logout",function(e,t){e.session.user=null,t.redirect("/")}),e.post("/login",function(e,t){var i=crypto.createHash("md5").update(e.body.password).digest("hex");User.getFilter({name:e.body.name}).then(function(r){return r?r.password!=i?t.redirect("/login?err=2"):(e.session.user=r,void t.redirect("/")):t.redirect("/login?err=1")})}),e.get("/personal",auth.checkLogin),e.get("/personal",function(e,t){t.render("Client/personal.questionList.html",{user:e.session.user,websiteTitle:model.db.config.websiteTitle})})};