function generateId(){var e=uuid.v1().split("-");return`${e[4]}${e[3]}${e[2]}${e[1]}${e[0]}`}function defineModel(e,l){var t={};for(let e in l){let i=l[e];"object"==typeof i&&i.type?(i.allowNull=i.allowNull||!1,t[e]=i):t[e]={type:i,allowNull:!1}}return t._id={type:ID_TYPE,primaryKey:!0},t.createdBy={type:Sequelize.STRING(50),defaultValue:""},t.createdDate={type:Sequelize.DATE,defaultValue:Sequelize.NOW,allowNull:!1},t.updatedDate={type:Sequelize.DATE,defaultValue:Sequelize.NOW,allowNull:!1},t.isDeleted={type:Sequelize.BOOLEAN,defaultValue:!1},t.deletedBy={type:Sequelize.STRING(50),defaultValue:""},t.deletedDate={type:Sequelize.DATE,allowNull:!0},t.version={type:Sequelize.BIGINT,defaultValue:0,allowNull:!1},sequelize.define(e,t,{tableName:e,timestamps:!1,hooks:{beforeValidate:function(e){let l=Date.now();e.isNewRecord?(console.log("will create entity..."+e),e._id||(e._id=generateId())):(console.log("will update entity..."),e.updatedDate=l,e.version++)}},charset:"utf8mb4"})}const Sequelize=require("sequelize"),uuid=require("uuid"),config=require("./settings");console.log("init sequelize...");var sequelize=new Sequelize(config.db,config.username,config.password,{host:config.host,dialect:"mysql",dialectOptions:{charset:"utf8mb4"},pool:{max:10,min:0,idle:3e4,acquire:3e4},timezone:"+08:00"});const ID_TYPE=Sequelize.STRING(50),TYPES=["STRING","INTEGER","BIGINT","TEXT","DECIMAL","DOUBLE","DATE","DATEONLY","BOOLEAN","NOW","DATEONLY"];var exp={defineModel:defineModel,sync:()=>{if("production"!==process.env.NODE_ENV)return sequelize.sync({force:!0});throw new Error("Cannot sync() when NODE_ENV is set to 'production'.")}};for(let e of TYPES)exp[e]=Sequelize[e];exp.ID=ID_TYPE,exp.generateId=generateId,exp.config=config,exp.sequelize=sequelize,module.exports=exp;