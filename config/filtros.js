var ejs 	= require('ejs');
var moment = require('moment');

ejs.filters.cDate= function(date){
  return moment(date).format('YYYY-MM-DD hh:mm');
},
ejs.filters.fromNow= function(date){
   return moment(date).fromNow()
}