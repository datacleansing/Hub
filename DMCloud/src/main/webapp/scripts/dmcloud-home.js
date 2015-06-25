/**
 * 
 */

buildHomePage = function(){
	$.getScript('scripts/page-builder.js',
		function(){
			$('body').buildPage("Home", function() {
				$('body').buildSvcSearcher();
			});
		});
};
