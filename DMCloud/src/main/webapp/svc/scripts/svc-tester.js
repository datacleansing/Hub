/**
 * 
 */

testExecuter = function(svcKey) {
	var inputJson = $('#inputTbl').populateInputDataJson();
	
	$.ajax({
		url : "rest/svc/" + svcKey,
		type : "POST",
		data : inputJson,
		dataType : "json",
		
		success : function(json) {
			alert("test executer" + JSON.stringify(json));
		},

		// Code to run if the request fails; the raw request and
		// status codes are passed to the function
		error : function(xhr, status, errorThrown) {
			alert("Sorry, there was a problem!");
			console.log("Error: " + errorThrown);
			console.log("Status: " + status);
			console.dir(xhr);
		}
	});
}

buildTesterPage = function() {

	$.getScript('../scripts/page-builder.js', function() {
		$('body').buildSvcPage(
				function(svcKey) {
					var inputTbl = $('<table>').attr('id', "inputTbl").attr(
							"border", 1);
					var outputTbl = $('<table>').attr('id', "outputTbl").attr(
							"border", 1);
					var testBtn = $('<button>').button().text("Test").click(
							function() {
								testExecuter(svcKey);
							});

					$('body').append(inputTbl);
					$('body').append(testBtn);
					$('body').append(outputTbl);

					$.getScript('scripts/data-loader.js', function() {
						
						loadExecuterInputAttributes(svcKey, function(attrs) {
							$('#inputTbl').buildInputAttributesTable(attrs);
						});

						loadExecuterOutputAttributes(svcKey, function(attrs) {
							$('#outputTbl').buildOutputAttributesTable(attrs);
						});
					});
				});
	});
};
