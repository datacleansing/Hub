/**
 * 
 */


buildDetailsPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcDetailsPage(
				function(svcKey) {
					$('#viewRegion').append($('<p>').text('Metadata Summary'));
				});
	});
};

buildMetadataDetailsPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcDetailsPage(
				function(svcKey) {
					var metadata = $('<div>').attr("id", "metadata");
					
					$('#viewRegion').append(metadata);

					$.getScript('../scripts/data-loader.js', function() {
						loadSvcMetadata(svcKey, function(attrs) {
							metadata.buildMetadata(attrs);
						});						
					});
				});
	});
};

buildUsageDetailsPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcDetailsPage(
				function(svcKey) {
					var in_out_view = $('<div>').attr("id", "in_out");
					
					$('#viewRegion').append(in_out_view);

					$.getScript('scripts/data-loader.js', function() {

						loadExecuterInputAttributes(svcKey, function(attrs) {
							in_out_view.buildInputAttributesTable(attrs);
						});

						loadExecuterOutputAttributes(svcKey, function(attrs) {
							in_out_view.buildOutputAttributesTable(attrs);
						});
						
					});
				});
	});
};
