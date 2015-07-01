/**
 * 
 */

dmcloud = function(fun){
	$.getScript('../scripts/page-builder.js',
		function(){
		fun();
	});
};
