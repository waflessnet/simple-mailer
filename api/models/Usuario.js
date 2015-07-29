/**
* Usuario.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
  schema:true,
  attributes: {
  		//nombre   : { type: 'string', required:true }, 
  		username : { type: 'string', required:true },
  		email    : { type: 'string', required:true,unique:true }, 
  		password : { type: 'string', required:true },
  		rol		 : { type: 'string',required:true },
  		status   : {type: 'integer'},

  	verifyPassword : function(password){
  	 var obj = this.toObject(); 
  	 if(obj.password == password){ // agregar cifrado
  	 	return true;
  	 }
  	 return false;
  },


  },

  toJSON: function() {
		var obj = this.toObject();
		delete obj.password;
		return obj;  
	},
   beforeCreate: function(values,cb){
   		 values.username  = ToolService.trim(values.username);
   		 values.password  = ToolService.trim(values.password);
   		 values.rol		  = ToolService.trim(values.rol);
   		 values.status    = 0; 
   		 cb();
   		 //return values;


   }
  /*beforeCreate: function(values, next) {
		hashPassword(values, next);
	},
  beforeUpdate: function(values, next) {
		if(values.password) hashPassword(values, next);
		else next();
	}*/



};

/*var bcrypt = require('bcrypt');

function hashPassword(values, next) {
	bcrypt.hash(values.password, 10, function(err, hash) {
		if (err) return next(err);

		values.password = hash;
		next();
	});
}*/
