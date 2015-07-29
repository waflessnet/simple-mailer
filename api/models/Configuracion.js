/**
* Configuracion.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {

  attributes: {
  		idValor : { type: 'string', required:true }, // nombre de la lista
  		valor   : { type: 'string', required:true},
  		estado  : { type: 'string', required:true }, // nombre de la campana
  }
};