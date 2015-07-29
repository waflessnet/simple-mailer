 

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


module.exports = {
    enviarMail: function(toMail,titulo,contenido,idCampanaSalida,cb){
    var io          = sails.io;
	var transporter = nodemailer.createTransport(smtpTransport({
	    host: sails.config.configSimple.smtp.host, 
	    port: sails.config.configSimple.smtp.port,
	    auth: {
	        user: sails.config.configSimple.smtp.user,
	        pass: sails.config.configSimple.smtp.pass
	    },
	    secureConnection: 'false',
	    tls: { ciphers: 'SSLv3' }
	}));
	 var optionsMail = {
	    from: sails.config.configSimple.smtp.from,
	    to: toMail,
	    subject: titulo, 
	    text: contenido,
	    html: "<html><head> <meta charset='utf-8'></head><body><div style='max-width: 600px !important;text-align:center;'>"+contenido+"</div> <div><img src='"+sails.config.urlDomain+"/Campana/Traking?k="+idCampanaSalida+"&lrf="+toMail+"' /></div> </body></html>"
	
	 }

	 transporter.sendMail(optionsMail,function(err,info) {

	 	
	 	//console.log(total);
	 	if(err)
			return cb(err,null);
		return cb(null,true);
	
	})

	
	

    },
    
 



}
