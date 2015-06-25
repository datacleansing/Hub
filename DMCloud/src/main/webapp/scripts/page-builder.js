/**
 * 
 */
jQuery.fn.extend({
	
	buildHeader: function(suffix)
	{
		$(this).append($('<p>').append(
				$('<font>').attr("size", "40").text("DMV - " + suffix)));
		$(this).append($('<hr>'));
	},
	
	buildFooter: function()
	{
		$(this).append($('<hr>'));
	},
	
	buildPage: function(suffix, fun)
	{
		$.ajaxSetup({
			  contentType: "application/json; charset=utf-8"
			});

		$.getScript('/DMCloud/scripts/data-loader.js', function(){
			$('body').buildHeader(suffix);
			fun();
			$('body').buildFooter();
		});
	},
	
	buildModelSelector: function()
	{
		var searchModel = function(searchValue)
		{
			var dataHolder = $('#modelSelctorTable');
			searchModelMetadata({access:"private"}, function( json ) {
				dataHolder.empty();
		    	$.each(json, function(i, item)
				{
		    		var svcKey = item.key;
			    	var row = $('<tr>');
			    	row.append(
			        		$('<td>').attr('width', "100%").append(
			        			$('<a>').text(item.name).attr("target", "_blank").attr("href", "model/Model.html#"+svcKey)));
			        //row.append(
			        //        $('<td>').append(
			        //        	$('<a>').text("Test").attr("target", "_blank").attr("href", "Tester.html#"+svcKey)));
			        dataHolder.append(row);
				});
		    });
		}
		var table = $('<table>').attr('border',"1");
		var searchField = $('<input>').
				attr('type', "text").
				attr('id', "searchField");
		var searchBtn = $('<button>').button().
				text("Search").
				click(function() {
					searchModel($('#searchField').val());
				});
		var createLinker = $('<a>').button().
				text("Search").
				click(function() {
					searchDMSvc($('#searchField').val());
				});
		table.append(
				$('<tr>').append(
					$('<td>').attr('width', '100%').append(searchField)).append(
					$('<td>').append(searchField)).append(
					$('<td>').append(searchBtn))
				);
		
		$(this).append(table)
		$(this).append($('<table>').attr('id','modelSelctorTable'));
		searchModel(null);
		
		return $(this);
	},
	
	buildSvcSearcher: function()
	{
		var searchDMSvc = function(searchValue)
		{
			var dataHolder = $('#mainTable');
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
		var table = $('<table>').attr('border',"1");
		var searchField = $('<input>').
				attr('type', "text").
				attr('id', "searchField");
		var searchBtn = $('<button>').button().
				text("Search").
				click(function() {
					searchDMSvc($('#searchField').val());
				});
		table.append(
				$('<tr>').append(
					$('<td>').attr('width', '100%').text("DMService List")).append(
					$('<td>').append(searchField)).append(
					$('<td>').append(searchBtn))
				);
		
		$(this).append(table)
		$(this).append($('<table>').attr('id','mainTable'));
		searchDMSvc(null);
		
		return $(this);
	}
});