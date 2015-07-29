/**
 * ListasController
 *
 * @description :: Server-side logic for managing Agroseguros
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	index: function(req,res){
		Listas.find().exec(function(err,data){
		 	if(err) return res.view({lista:[]});
		 	return res.view({lista:data});
		 });
		
	},
	listar: function(req,res){
		 Listas.find().exec(function(err,data){
		 	if(err) return res.send('-1');
		 	return res.send(data);
		 });

		 
	}
	
};

