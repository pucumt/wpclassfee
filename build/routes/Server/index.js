var login=require("./login.js"),logout=require("./logout.js"),user=require("./user.js"),question=require("./question.js");module.exports=function(e){login(e),logout(e),user(e),question(e)};