/**
* Listas.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema:true,
  attributes: {
  		nombreLista: { type: 'string', required:true,unique:true },
  		descripcion: { type: 'string',required:true }
  },
  beforeDestroy: function(values,cb){
  	 //console.log(values.where.id);
  	 if(!("where" in values))
  	 	 if(!("id" in values.where))
  	 	 		return cb();
  	 Email.destroy({idlista:values.where.id},function(){
  	 	//console.log("elimiandos");
  	 })
  	cb(); 
  }

};

