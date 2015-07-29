/**
* CampanaSalida.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		lista: { type: 'string', required:true }, // nombre de la lista
  		idCampana : { type: 'string', required:true},
  		campana :{ type: 'string', required:true }, // nombre de la campana
  		enviado : { type: 'INTEGER' }, //
  }
};

