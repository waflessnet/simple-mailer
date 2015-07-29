
var ddebug,pTotal=0,p=0,$notify,nCampana;
$(document).ready(function(){

	 $('#table').dataTable({
          "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]]
        });
    
     $('#summernote').summernote({
     	height: 300,                 // set editor height
  	onImageUpload: function(files, editor, welEditable) {
  	          console.log('image upload:', files, editor, welEditable);
            sendFile(files[0], editor, welEditable); 
        }
     });

 ///------
//$('#summernote').summernote("insertImage",'http://i.ytimg.com/vi/g-fN8FYwpIw/maxresdefault.jpg');
 function sendFile(file, editor, welEditable) {
        data = new FormData();
        console.log(file);
        data.append("file", file);
        //var _csrf = $("form[name='create'] ").find('input[name="_csrf"]').val();
        //data.append("_csrf",_csrf);  
        //var editor = $.summernote.eventHandler.getEditor(); 


        $.ajax({
            data: data,
            type: 'POST',
            /*xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) myXhr.upload.addEventListener('progress',progressHandlingFunction, false);
                return myXhr;
            },*/
            url:'/campana/uploadfile',  
            //cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
            	console.log(data);
            	console.log(editor);
            	ddebug = editor;
                $('#summernote').summernote("insertImage",data.url); 
            }
        });
}

// update progress bar

function progressHandlingFunction(e){
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded, max:e.total});
        // reset progress on complete
        if (e.loaded == e.total) {
            $('progress').attr('value','0.0');
        }
    }
}


 ///------
    
	$.fn.serializeObject = function()
	{
	   var o = {};
	   var a = this.serializeArray();
	   $.each(a, function() {
	       if (o[this.name]) {
	           if (!o[this.name].push) {
	               o[this.name] = [o[this.name]];
	           }
	           o[this.name].push((this.value || '').trim());
	       } else {
	           o[this.name] = (this.value || '').trim();
	       }
	   });
	   return o;
	};

	$.fn.resetForm = function() {
    return this.each(function(){
        this.reset();
    });
	}

	$('#myModal').on('shown.bs.modal', function() {
    	$("form[name='crear']").find("#mensajeNegativo").hide();
    	$("form[name='crear']").find("#mensajePositivo").hide();
    	$("form[name='crear']").resetForm();
	});

	$('#myModal').on('hidden.bs.modal', function() {
    	$("form[name='crear']").find("#mensajeNegativo").hide();
    	$("form[name='crear']").find("#mensajePositivo").hide();
    	$("form[name='crear']").resetForm(); 
    	$('#myModal').find("#actualizar").attr('disabled',true); 
    	$("#myModal").find('#actualizar').attr('data-id',''); 
    	//$('#listaEmail').dataTable().fnDestroy();
    	//$('#listaEmail').html("");
	});

     $("form[name='show']").on('submit',function(){
     	//actualizar
     	var $form 	   = $(this);
		var valuesForm = $form.serializeObject();
		var actionForm = $form.attr('action');
		$('#myModal').find("#actualizar").attr('disabled',false); 
		$('#myModal').modal('show'); 


		$.get(actionForm,valuesForm,function(data){
			$.each(data,function(index,el){
				if(index == 'id'){
				$("#myModal").find('#actualizar').attr('data-id',el);
						}
				/*if(index =="idlista"){
						$('#myModal').find("select[name='idlista']").val(el);
				}*/
				if( $('#myModal').find('input[name="'+index+'"]').length >0 ){
						if(index =='mensaje'){
							$("#summernote").code(el);
						}
						$('#myModal').find('input[name="'+index+'"]').val(el); 
				}
			})
		});
     	return false;
     });

     $("#actualizar").on('click',function(){
     		var   url  = $(this).attr('data-url');
     		var  $form = $("form[name='create']");
     		var   id   = $(this).attr('data-id');
     		url = url+""+id;

     		var valuesForm = $form.serializeObject();  
     		/*if(valuesForm.idlista == "-1"){
	         	$form.find("#mensajeNegativo").show();
	         	$form.find("#mensajeNegativo").html("Debes seleccionar una lista");
	         	return false;
         	} */
         	$("form[name='crear'] input[type='text'], textarea").each(function(){
    				$(this).val(jQuery.trim($(this).val()));
				});
         	 valuesForm.mensaje = $("#summernote").code(); 
     		$.post(url,valuesForm,function(data){
     				// recargar 
     				location.reload();
     		}).fail(function(data){
			//console.log(data.responseJSON); 
			$form.find("#mensajePositivo").hide();
			$form.find("#mensajeNegativo").show();
			//$form.find("#mensajeNegativo").html("Error: "+ data.responseJSON.error );
			ddebug = $form;
			$form.find("#mensajeNegativo").append("Error : <br>");
			$.each(data.responseJSON.invalidAttributes,function(index,el){
				 $form.find("#mensajeNegativo").append(" - "+index);
				 $form.find('input[name="'+index+'"]').parent().addClass('has-danger');
			});

		});

     })

	$("form[name='create']").on('submit',function(){
		var $form 	   = $(this);
		//trim 
		// 
		if($form.find("#summernote").length > 0){
			var code = $("#summernote").code();
		    $form.find("input[name='mensaje']").val(code);
		}
		$("form[name='crear'] input[type='text'], textarea").each(function(){
    		$(this).val(jQuery.trim($(this).val()));
		});
		//
		var valuesForm = $form.serializeObject();
		var actionForm = $form.attr('action');
        // validamos los selects 
        
         if(valuesForm.idlista == "-1"){
         	$form.find("#mensajeNegativo").show();
         	$form.find("#mensajeNegativo").html("Debes seleccionar una lista");
         	return false;
         }

         
         // si es upload
         if($form.attr('data-form') =='upload'){
 			 var fd = new FormData();
 			 fd.append("file",jQuery("form input[name='file']").get(0).files[0]); 
 			 //fd.append("valuesForm",valuesForm);
 			 var _csrf = $form.find('input[name="_csrf"]').val(); 
 			 $.ajax({
			       url: "/email/upload?_csrf="+_csrf+"&idlista="+valuesForm.idlista,
			       type: "POST",
			       data: fd,
			       processData: false,
			       contentType: false,
			       success: function(response) {
			           // .. do something
			           location.reload();
			       },
			       error: function(jqXHR, textStatus, errorMessage) {
			           console.log(errorMessage); // Optional
			       }
			    });

         	// $form.ajaxForm();
         	 //console.log("a");
         	 return false;
         }


		$.post(actionForm,valuesForm,function(data){ 
				$form.find("#mensajeNegativo").hide();
				$form.find("#mensajePositivo").show();
				$form.find("#mensajePositivo").html("Guardado con exito");
				$form.resetForm();
				location.reload();
		}).fail(function(data){
			//console.log(data.responseJSON); 
			$form.find("#mensajePositivo").hide();
			$form.find("#mensajeNegativo").show();
			$form.find("#mensajeNegativo").html("");
			//$form.find("#mensajeNegativo").html("Error: "+ data.responseJSON.error );
			ddebug = $form;
			$form.find("#mensajeNegativo").append("Error : <br>");
			$.each(data.responseJSON.invalidAttributes,function(index,el){
				 $form.find("#mensajeNegativo").append(" - "+index);
				 $form.find('input[name="'+index+'"]').parent().addClass('has-danger');
			});
			if(data.status==500){
				$form.find("#mensajeNegativo").append("Usuario o email ya esta registrado");
			}

		});
		return false; 
	});
	$("form[name='enviar']").on('submit',function(){  
		var $form 	   = $(this);
		var valuesForm = $form.serializeObject();
		var actionForm = $form.attr('action');
		//console.log(valuesForm);
		$.get(actionForm,valuesForm,function(data){
				console.log(data);
		}); 
		return false;
	}); 

  $.fn.eliminar = function(form,tipo){

  	 	var $form 	   = $(form);
		var valuesForm = $form.serializeObject();
		var actionForm = $form.attr('action');
		console.log(valuesForm);

  	 switch(tipo){
  	 	// lista
  	 	case 'lista':
  	 	var r= confirm("Sí elimina esta lista, eliminará todos los mails asociados a esta,¿ Estas seguro ?");
		if(!(r == true)){
			return false;
		}
		//campana and list remove
  	 	case 'campana':
  	 		$.post(actionForm,valuesForm,function(data){

			  $("#lista"+valuesForm.id).remove();
			  $("#campana"+valuesForm.id).remove();
			$.notify({ 
			 	message: '<strong>'+tipo+' eliminada correctamente</strong>' ,
			 	animate: {
					enter: 'animated bounceInDown',
					exit: 'animated bounceOutUp'
				}
			 },{
			 	type: 'success',
			 	

			 });
				
		}).fail(function(data){
			 $.notify({ 
			 	message: '<strong>Ocurrio un error, favor intentar nuevamente</strong>',
			 	animate: {
					enter: 'animated bounceInDown',
					exit: 'animated bounceOutUp'
				}
			 },{
			 	type: 'danger'
			 });
		});
		break; 
		case 'usuario':
  	 		$.post(actionForm,valuesForm,function(data){

			  $("#lista"+valuesForm.id).remove();
			  //$("#campana"+valuesForm.id).remove();
			$.notify({ 
			 	message: '<strong>'+tipo+' eliminado correctamente</strong>' ,
			 	animate: {
					enter: 'animated bounceInDown',
					exit: 'animated bounceOutUp'
				}
			 },{
			 	type: 'success',
			 	

			 }); 
				 
		}).fail(function(data){
			 $.notify({ 
			 	message: '<strong>Ocurrio un error, favor intentar nuevamente</strong>',
			 	animate: {
					enter: 'animated bounceInDown',
					exit: 'animated bounceOutUp'
				}
			 },{
			 	type: 'danger'
			 });
		});
		break; 
		


		break;

  	 }
  	 return false; 
  }

  $.fn.ver=function(form,tipo,id){
  	 var $form 	    = $(form);
	 var valuesForm = $form.serializeObject();
	 var actionForm = $form.attr('action');
	 var table 		= "";
		//console.log(valuesForm);
	switch(tipo){
		case 'lista':
			//desplegar todas las cuentas asociadas a esta lista 
			/*$('#listaEmail').dataTable( {
		        "ajax":"/email/find?idlista="+id+"&limit=200",
		        "columns": [
		            { "data": "nombre" },
		            { "data": "email" },
		            { "data": "createdAt" }
		        ]
    		} );*/
			        

			$.get("/email/find?idlista="+id+"&limit=200",function(data){
					table="<table><thead><tr><th>Email</th><th>Nombre</th><th>Fecha</th><th>#</th></tr></thead><tbody>";
				 $.each(data,function(index,el){
				 	table += "<tr><td>"+el.email+"</td><td>"+el.nombre+"<td>"+moment(el.createdAt).format("DD-MM-YYYY")+"</td><td>Action</td></tr>";
				 });
				 	table += "</tbody></table>";
				 	//console.log(table);
				 	if($.fn.dataTable.isDataTable("#listaEmail")){
				 		$('#listaEmail').dataTable().fnDestroy(); 
				 	}
				 	$('#listaEmail').html("");
				 	$('#listaEmail').html(table); 
				 	$('#listaEmail').dataTable({});
				 	$("#myModal1").modal('show');

			});

		break;

		case 'email' :
			// mostrar todos los datos de este mail
		break;

	}

		return false;
  }
	
	// Cargar listas 
	//
	 $("#campana").on('change',function(){
	 		//cargar html
	 		$("#loader").show();
	 		 var id = $(this).val();
	 		 if(id == "-1"){ 
	 		 	$("#verMensaje").html("");
	 		 	$("#loader").hide();
	 		 		return false;
	 		 }
	 		 	
	 		$.get('/campana/'+id,function(data){
	 			if(data.mensaje){
	 					$("#verMensaje").html("");
	 					$("#verMensaje").html(data.mensaje);
	 					$("#loader").hide(); 
	 			}
	 		});
	 });
	 /*var notify = $.notify('<strong>Enviando</strong>  Campaña:...', {
			allow_dismiss: false,
			showProgressbar: true,
			delay:0
	});*/
	  io.socket.on('porcentaje',function(data){
            // campana saliendo.-
            if(data.index > 0 && !$notify){
            	$notify = $.notify('<strong>Enviando</strong>  Campaña:'+data.campana, {
					allow_dismiss: false,
					showProgressbar: true,
					delay:0
				});
            }

	  		
	  		p = (data.index*100)/ data.total;
	  		p = p.toFixed(0);


	
  			$notify.update({'type': 'success','message':'<strong>Enviando</strong>  Campaña:'+data.campana+ ' '+data.index+'/'+data.total , 'progress':p});
	  		if(p >= 100){
	  			$notify.close();
	  			//nCampana  = "";
	  			console.log("TERMINO");
	  			//window.location.href="/Campana/Estadistica/"
	  		}

	  		
	  });
	  io.socket.on('comenzo',function(data){
	  			nCampana = data.campana;
	  			$notify = $.notify('<strong>Enviando</strong>  Campaña:'+data.campana, {
					allow_dismiss: false,
					showProgressbar: true,
					delay:0
				});

	  })
	
});