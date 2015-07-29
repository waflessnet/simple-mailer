/**
 * UsusarioController
 *
 * @description :: Server-side logic for managing Agroseguros
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');
module.exports = {
	 index: function(req,res){
	  
	  Usuario.find().exec(function(err,users){
	  		return res.view({locals:{users:users}}); 
	  });

      
	 	
	 },




	 //deberían ir en authController 
	 login: function(req,res){

	 	if(req.method === 'GET'){
	 		 return res.view(); 
	 	}
	 	passport.authenticate('local',function(err,user,info){
	 		if( (err) || (!user) ){
	 			 return res.view({locals:{message:info.message,user:user} }); 
	 			 //return res.send();
	 		}
	 		req.logIn(user,function(err){
	 			if(err) res.view({locals:{message:"Error de conexion"} }); 
	 			//redirect
	 			req.session.user=user;
	 			 return res.redirect('/Home');
	 			//return res.json({message:info.message,user:user}); 
	 		});
	 	})(req,res); 

	 },
	 logout: function(req, res) {
        req.logout();
        res.redirect('/'); 
    }
}; 