/**
 * CampanaController
 *
 * @description :: Server-side logic for managing Agroseguros
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	index: function(req,res){
		Campana.find({sort: 'createdAt DESC'}).exec(function(err,data0){
		 	if(err) return res.view({listas:[],campana:[]});
		 	Listas.find({sort: 'createdAt DESC'}).exec(function(err,data1){
		 		if(err) return res.view({listas:[],campana:[]});
		 			return res.view({listas:data1,campana:data0});	
		 	})
		 	
		 });
		//return res.view();
	},
	//upload images
	uploadfile: function(req,res){
		if(req.method === 'GET')
			return res.json({'status':'GET not allowed'});						
			//	Call to /upload via GET is error
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
     var uuid		   = ToolService.uuid();
     var rpath   	   = process.cwd();
     var localDir	   = rpath+"/.tmp/uploads/mailer/"+uuid+"/";
     //console.log(appDir);
     //console.log(idlista);
    req.file('file')
    .upload({
      dirname: localDir,
      // You can apply a file upload limit (in bytes)
      maxBytes: 10000000
      
    }, function whenDone(err, uploadedFiles) {
      if (err) return res.serverError(err);
	  if (uploadedFiles.length === 0){
       return res.badRequest('No file was uploaded');
      } 
       ToolService.uploadSftp(localDir,function(err,url){ 
       		if(err) return res.serverError(err);
      		res.json({status:200,file:uploadedFiles[0].fd,url:url}); 	
       })
      
  	});

	},
   // listar todas las campañas enviadas 
   estadistica: function(req,res){ 
   
    CampanaSalida.find({sort: 'createdAt DESC'}).exec(function(err,data){
          return res.view({salida:data});
    })
     
   },
   emails: function(req,res){
     var requestParams = req.params.all();
     var id            =  requestParams.id || 0 
     if(id == 0){
      // redirect
     }
      EmailSalida.find({idCampanaSalida:id}).exec(function(err,data){
          return res.view({emails:data});
      })

     
   },
   traking: function(req,res){
    var fs            = require('fs');
    var path          = require('path');
    var requestParams = req.params.all();
    //
    var appDir    = path.resolve(__dirname);
    var img       = fs.readFileSync(appDir+'/../../assets/images/mailer.png');
    var idCampana = requestParams.k;
    var idEmail   = requestParams.lrf;
    EmailSalida.update({idCampanaSalida:idCampana,email:idEmail},{visto:1}).exec(function(err,response){ 
        //console.log(err,response);
    });


        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');

   }
};

