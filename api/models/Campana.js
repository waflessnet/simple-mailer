/**
* Campana.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	schema:true,
  attributes: {
  		//idlista   : { type: 'string', required:true },  		
  		campana    : { type: 'string', required:true, unique:true },
  		asunto    : { type: 'string', required:true },
  		//usuario   : { type: 'string', required:true },
  		mensaje   : { type: 'string', required:true }, 

  }
};

