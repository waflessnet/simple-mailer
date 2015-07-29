/**
 * EmailController
 *
 * @description :: Server-side logic for managing Agroseguros
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	index: function(req,res){
		Email.find({sort: 'createdAt DESC'}).exec(function(err,data0){
		 	if(err) return res.view({listas:[],emails:[]});
		 	Listas.find({sort: 'createdAt DESC'}).exec(function(err,data1){
		 		if(err) return res.view({listas:[],emails:[]});

		 			return res.view({listas:data1,emails:data0}); 	
		 	})
		 	
		 });
	},

	preview: function(req,res){

		Campana.find({sort: 'createdAt DESC'}).exec(function(err,data0){
		 	if(err) return res.view({listas:[],campana:[]});
		 	Listas.find({sort: 'createdAt DESC'}).exec(function(err,data1){
		 		if(err) return res.view({listas:[],campana:[]});

		 			return res.view({listas:data1,campana:data0}); 	
		 	})
		 	
		 });
	},

  enviar: function(req,res){

      var requestParams = req.params.all();
      var idCampana     = requestParams.campana;
      var idLista       = requestParams.idlista;
      var io            = sails.io;
      var objCampana    = {};

      Campana.findOne({id:idCampana}).exec( function(err,data0){
        Listas.findOne({id:idLista}).exec(function(err,dLista) {


        CampanaSalida.create({lista:dLista.nombreLista,idCampana:idCampana,campana:data0.campana,enviado:1,contenido:data0.mensaje}).exec(function(err,cSalida){ 
      
        Email.find({idlista:idLista}).exec(function(err,data1){
          var emailsTotal   =  data1.length;
          var emails        =  data1;
          var campana       =  data0;
          var campanaSalida =  cSalida;


          io.sockets.emit('comenzo',{ total:emailsTotal,campana:campana.campana});
          // recursive timeout
           process.nextTick(function(){
              rec(emails,campana,campanaSalida,0,function(data){
                   return res.json({mensaje:campana,email:emails});
            });
           }); 
            
            
            function rec (emails,campana,campanaSalida,index,cb){
               //var total  = emails.length;
               if(index >= emails.length){
                 return cb("terminado");
               }
               setTimeout(function() {
                objCampana = {
                   lista            : idLista,
                   idCampana        : campana.id,
                   idCampanaSalida  : campanaSalida.id,
                   campana          : campana.campana,
                   email            : emails[index].email,
                   enviado : 0,
                   
                }
                EnviarMailService.enviarMail(objCampana.email,campana.asunto,campana.mensaje,objCampana.idCampanaSalida,function(err,data){
                   if (err) objCampana.enviado = 0;
                   else objCampana.enviado = 1;
                    EmailSalida.create(objCampana).exec(function(){
                          //console.log(index+1);
                          io.sockets.emit('porcentaje',{ total:emails.length,index:index+1,campana:campana.campana});
                          rec(emails,campana,campanaSalida,index+1,cb); 
                          
                  });


              });
              },1000);    
            };
         
            });  //CampanaSalida


        }); //Email
         });// listas
      }); //Campana

    },
 





	upload: function(req,res){
	// e.g.
    // 0 => infinite
    // 240000 => 4 minutes (240,000 miliseconds)
    // etc.
    //
    // Node defaults to 2 minutes.
    res.setTimeout(4000); 

    // key para acceder al tipo de dato a subir
    //console.log(req.file('file')._files[0].stream.headers.'content-type');
    var path = require('path');
     var requestParams = req.params.all();
     var idlista	   = requestParams.idlista;
     var appDir        = path.resolve(__dirname);
     var rpath 		   = process.cwd();

    req.file('file')
    .upload({
      dirname: rpath+"/.tmp/uploads/mailer/",
      // You can apply a file upload limit (in bytes)
      maxBytes: 10000000
      
    }, function whenDone(err, uploadedFiles) {
      if (err) return res.serverError(err);
	  if (uploadedFiles.length === 0){
       return res.badRequest('No file was uploaded');
      }
      console.log(uploadedFiles[0].fd);
      var emailsErrores=new Array();
      var emailsDuplicados= new Array();
      var c=0;
      //
      var csv = require("fast-csv");
 
			csv
			 .fromPath(uploadedFiles[0].fd,{headers:true,delimiter:';',ignoreEmpty:true})
			 .on("data", function(data){
 					cargarDatod(data,function(){

 					});
		     
			 }).on("data-invalid", function(data){
			 	 //
			 })

			 .on("end", function(){
			     //console.log("done");
			 });

      //
      function cargarDatod(data,cb){

   		 		    Email.create({idlista:idlista,email:data.email,nombre:data.nombre}).exec(function(err,data1){
   		 						if(err) emailsErrores.push(data.email);
   		 					     	return cb(1);
   		 						
 					});
      }


      function validateEmail(email) {
    				var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    			return re.test(email);
			}


      return res.json({
        files: uploadedFiles[0].fd,

        textParams: req.params.all()
      });
    });
  },

}

