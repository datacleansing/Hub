/**
 * 
 */

buildInputParametersPage = function(){
	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcParametersPage(function(svcKey){
			var input = $('<div>');
			
			$('#viewRegion').append(input);
			
			var isEdit = false;

			$.getScript('../scripts/data-loader.js', function() {
				loadSvcInput(svcKey, function(attrs) {
					input.buildInputPage(attrs, true);
				});
			});
		});
	});
}

buildPreprocesserParametersPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcParametersPage(function(svcKey){
			var preprocesser = $('<div>');
			
			$('#viewRegion').append(preprocesser);
			
			$.getScript('../scripts/data-loader.js', function() {
				loadSvcPreprocess(svcKey, function(attrs) {
					preprocesser.buildProcesserPage(attrs, true);
				});
			});
		});
	});
};

buildProcesserParametersPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcParametersPage(function(svcKey){
			var processer = $('<div>');
			
			$('#viewRegion').append(processer);
			
			$.getScript('../scripts/data-loader.js', function() {
				loadSvcProcesser(svcKey, function(attrs) {
					processer.buildProcesserPage(attrs, true);
				});
			});
		});
	});
};

buildPostprocesserParametersPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcParametersPage(function(svcKey){
			var postprocesser = $('<div>');
			
			$('#viewRegion').append(postprocesser);
			
			var isEdit = false;

			$.getScript('../scripts/data-loader.js', function() {
				loadSvcPostprocesser(svcKey, function(attrs) {
					postprocesser.buildProcesserPage(attrs, isEdit);
				});
			});
		});
	});
};

buildOutputParametersPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcParametersPage(function(svcKey){
			var output = $('<div>');
			
			$('#viewRegion').append(output);
			
			var isEdit = false;

			$.getScript('../scripts/data-loader.js', function() {
				loadSvcOutput(svcKey, function(attrs) {
					output.buildOutputPage(attrs, isEdit);
				});
			});
		});
	});
};

buildParametersPage = function() {

	$.getScript('scripts/svc-page.js', function() {
		$('body').buildSvcParametersPage(function(svcKey){
			$('#viewRegion').append($('<div>').text('Summary'));
		});
	});
};
