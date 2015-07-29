module.exports = { 

	uploadSftp: function(lDir,cb){
	    var Sftp    = require('sftp-upload');
      var fs      = require('fs');
      var path 	  = require('path');
      var appDir  = path.resolve(__dirname);
      var uuid 	  = ToolService.uuid();
      var remoteD = sails.config.configSimple.sftp.dirRemoto+uuid+'/' //directorio remote donde se depositan las imagenes.
      var url     = sails.config.configSimple.urlSalida+uuid+'/'; // url
      var nameFile= "#";
      var rpath   = process.cwd();
      //console.log('Current directory: ' + process.cwd());
      //console.log(appDir);
      //console.log(appDir);
      var options = {
        host:sails.config.configSimple.sftp.host,
        username:sails.config.configSimple.sftp.user,
        path: lDir,
        remoteDir: remoteD, 
        privateKey: fs.readFileSync(rpath+sails.config.configSimple.sftp.privateKey)
        },
        sftp = new Sftp(options);
        sftp.on('error', function(err){
        		cb(err,null);
        })
          .on('uploading', function(pgs){ 
            //console.log('Uploading', pgs.file);
            //console.log(pgs.percent+'% completed');
            //console.log(pgs);
            nameFile = pgs.file;
          })
          .on('completed', function(){
          	   //console.log(path.basename(nameFile));
          		url = url +path.basename(nameFile);
              cb(null,url);
          })
          .upload();
          
    },

    uuid: function(){
    	var uuid = require('node-uuid');	
    	return uuid.v4();
    },
    sleep: function (s,callback) {
        var seconds = s *1000;
        var now = new Date().getTime();
        while(new Date().getTime() < now + seconds) {
          // do nothing
        }
      callback();
    },
    trim: function(value){
        return value.replace(/^\s+|\s+$/g, "");
    }


}
