/**
 *
 */


$(document).ready(function() {
	function searchDMSvc(searchValue)
	{
		var dataHolder = $('#repoTable');
		searchSvcMetadata({access:"private"}, function( json ) {
			dataHolder.empty();
				$.each(json, function(i, item)
			{
					var svcKey = item.key;
					var row = $('<tr>');
					row.append(
								$('<td>').attr('width', "100%").append(
									$('<a>').text(item.name).attr("target", "_blank").attr("href", "svc/DMService.html#"+svcKey)));
						row.append(
										$('<td>').append(
											$('<a>').text("Test").attr("target", "_blank").attr("href", "Tester.html#"+svcKey)));
						dataHolder.append(row);
			});
			});
	}

	$('#launchBtn').button().
		text("Launch").
		click(function() {
			searchDMSvc($('#searchField').val());
	});
});
