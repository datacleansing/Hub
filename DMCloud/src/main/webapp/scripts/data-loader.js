/**
 * 
 */

searchSvcMetadata = function(filter, successCallback)
{
	 $.post(
		"/DMCloud/rest/metadata/svc",
		JSON.stringify(filter),
		successCallback);
}

searchModelMetadata = function(filter, successCallback)
{
	 $.post(
		"/DMCloud/rest/metadata/model",
		JSON.stringify(filter),
		successCallback);
}

searchArchive = function(filter, successCallback)
{
	 $.post(
		"/DMCloud/rest/archive",
		JSON.stringify(filter),
		successCallback);
}

loadArchive = function(key, successCallback)
{
	 $.get(
		"rest/archive/" + key,
		null,
		successCallback);
}

loadAcl = function(key, successCallback)
{
	 $.get(
		"rest/acl/" + key,
		null,
		successCallback);
}

loadAttrs = function(catalog, key, res, successCallback)
{
	  $.get(
		"../rest/" + catalog + "/" + key + "/" + res,
	    null,
	    successCallback);
}

loadModelAttrs = function(svcKey, res, successCallback)
{
	  loadAttrs("model", svcKey, res, successCallback);
}

loadModelMetadata = function(key, successCallback)
{
	  loadSvcAttrs(key, "metadata", successCallback);
}

loadSvcAttrs = function(svcKey, res, successCallback)
{
	  loadAttrs("svc", svcKey, res, successCallback);
}

loadSvcMetadata = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "metadata", successCallback);
}

loadSvcInputAttributes = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "inputAttrs", successCallback);
}

loadSvcOutputAttributes = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "outputAttrs", successCallback);
}

loadSvcInput = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "input", successCallback);
}

loadSvcPreprocess = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "preprocesser", successCallback);
}

loadSvcProcesser = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "processer", successCallback);
}

loadSvcPostprocesser = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "postprocesser", successCallback);
}

loadSvcOutput = function(svcKey, successCallback)
{
	  loadSvcAttrs(svcKey, "output", successCallback);
}