/**
 * 
 */
jQuery.fn.extend({
	
	buildSvcPage: function(fun)
	{
		var target = $(this);
		$.getScript("../scripts/page-builder.js", function(){
			target.buildPage("Service", function(){
				if(window.location.hash)
				{
					var svcKey = window.location.hash.substring(1);
					
					var table = $('<table>').attr('width', '100%');
					table.append($('<tr>').append(
							$('<td>').append($('<a>').attr('href', 'DMService.html#' + svcKey).text("Dashboard"))
					).append(
							$('<td>').append($('<a>').attr('href', 'Parameters.html#' + svcKey).text("Parameters"))
					).append(
							$('<td>').append($('<a>').attr('href', 'ACL.html#' + svcKey).text("ACL"))
					).append(
							$('<td>').append($('<a>').attr('href', 'Tester.html#' + svcKey).text("Test"))
					));
					$('body').append(table).append($('<hr>'));
					fun(svcKey);
				}
				else
				{
					$('body').append($('<p>').append($('<font>').attr("size","24").text("404, no such DMService founded")));
				}
			});
		});
	},
	
	buildSvcCompositePage:function(linkers, fun){
		var table = $('<table>').attr('width', "100%");
		var linkersRegion = $('<td>').attr('style', "width:200px");
		var viewRegion = $('<td>').attr('width', "100%").attr('id', "viewRegion");
		
		$('body').buildSvcPage(function(svcKey){
			$('body').append(table);
			table.append(
					$('<tr>').attr("valign", "top").append(
						linkersRegion.buildLinkItems(svcKey, linkers)
					).append(viewRegion));
			fun(svcKey);
		});
		return $(this);
	},
	
	buildSvcDetailsPage: function(fun){
		var linkers = [{
				'title': "Details",
				'linkers': [
				    {
				    	href: "Metadata.html",
				    	text: "Metadata"
				    },
				    {
				    	href: "Usage.html",
				    	text: "Usage"
				    },]
				},
			]
		return $('body').buildSvcCompositePage(linkers, fun);
	},
	
	buildSvcParametersPage: function(fun){
		var linkers = [{
				'title': "Parameters",
				'linkers': [
				    {
				    	href: "ParametersInput.html",
				    	text: "Input"
				    },
				    {
				    	href: "ParametersPreprocesser.html",
				    	text: "PreProcesser"
				    },
				    {
				    	href: "ParametersProcesser.html",
				    	text: "Processer"
				    },
				    {
				    	href: "ParametersPostprocesser.html",
				    	text: "PostProcesser"
				    },
				    {
				    	href: "ParametersOutput.html",
				    	text: "Output"
				    }]
				},
			]
		return $('body').buildSvcCompositePage(linkers, fun);
	},
	
	buildField : function(type, key)
	{
		 $(this).append($('<input>').attr("id", key));
		 return $(this);
	},
	
	buildInputAttributesTable:function(attrs)
	{
		var table = $(this).empty();
		table.append($('<tr>').append(
				$('<th>').text("Name")
		).append(
				$('<th>').attr("width","100%").text("Description")
		).append(
				$('<th>').text("value")
		));
    	$.each(attrs, function(i, item)
		{
    		table.append($('<tr>').append(
    				$('<td>').text(item.name)
    		).append(
    				$('<td>').text(item.description)
    		).append(
    				$('<td>').buildField(item.type, item.key)
    		));
		});
	},
	
	populateInputDataJson:function()
	{
		var row = {
				"values" : {}
		};
		$.each($(this).find('input'), function(i, item){
			row['values'][item.id] = item.value;
		});
		var data = {
				"observations" : [row]
		}
		
		return JSON.stringify(data);
	},
	
	buildOutputAttributesTable:function(attrs)
	{
		var table = $(this).empty();
		var row = $('<tr>');
    	$.each(attrs, function(i, item)
		{
    		row.append($('<th>').text(item.name));
		});
    	table.append(row);
	},
	
	buildLinkItems: function(svcKey, linkers)
	{
		var parent = $(this);
		$.each(linkers, function(i, res){
			var subL = $('<ul>');
			$.each(res.linkers, function(i, item){
				subL.append(
					$('<li>').append(
						$('<a>').attr('href', item.href + '#' + svcKey).text(item.text)
				))
			});
			parent.append(
					$('<ul>').append(
							$('<li>').append(
									$('<span>').text(res.title)
							).append(subL)));
		});
		
		return $(this);
	},
	
	buildModelSelctor: function(model)
	{
		var modelSelector = $('<div>').buildModelSelector();
		
		var selector = $("<div>").append(modelSelector);
		
		var table = $('<table>').attr("width", "100%").attr("id", "modelSelector");
		var tr = $('<tr>');
		tr.append(
				$('<td>').attr("width", "100%").append(selector)
		).append(
				$('<td>').attr("width", "20%").append($('<a>').attr("id", "hideModelSelectorButton").attr("href", "javascript:void(0)").text("Hide").click(function(){
					$('#showModelSelectorButton').show();
					$('#modelSelector').hide();
				}))
		);
		return $(this).append(table.append(tr));
	},
	
	buildModelView: function(model){
		var table = $('<table>').attr("width", "100%").attr("id", "modelView");
		var modelSelector = $('<div>').buildModelSelctor();
		var tr = $('<tr>');
		tr.append(
				$('<td>').append(
						$('<a>').attr("href", "Model.html#" + model.key).text(model.name))
		).append(
				$('<td>').attr("width", "100%").append($('<p>').text(model.description))
		).append(
				$('<td>').attr("width", "20%").append($('<a>').attr("id", "showModelSelectorButton").attr("href", "javascript:void(0)").text("Select...").click(function(){
					$('#showModelSelectorButton').hide();
					$('#modelSelector').show();
				}))
		);
		$(this).append(table.append(tr)).append(modelSelector);
		$('#modelSelector').hide();
		return $(this);
	},
	
	buildInputPage: function(attrs, isEdit)
	{
		$(this).append($('<p>').text("input" + JSON.stringify(attrs)));
	},
	
	buildProcesserPage: function(attrs, isEdit)
	{
		var classView = $('<div>').text("Choose processer");
		var modelView = $('<div>');
		loadModelMetadata(attrs.modelKey, function(model){
			modelView.buildModelView(model);
		});
		
		$(this).append(classView).append(modelView);
	},
	
	buildOutputPage: function(attrs, isEdit)
	{
		$(this).append($('<p>').text("output" + JSON.stringify(attrs)));
	},
	
	buildMetadata: function(attrs)
	{
		$(this).append($('<p>').text("Metadata" + JSON.stringify(attrs)));
	},
	
	buildAclView: function(attrs)
	{
		$(this).append($('<p>').text("ACL" + JSON.stringify(attrs)));
	}
});