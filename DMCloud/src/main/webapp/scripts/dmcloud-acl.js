/**
 * 
 */


buildACLPage = function() {

	$.getScript('../scripts/page-builder.js', function() {
		$('body').buildSvcPage(
				function(svcKey) {
					$('body').append($('<p>').text("ACL"))
				});
	});
};
