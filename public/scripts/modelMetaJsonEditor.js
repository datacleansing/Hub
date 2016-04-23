
$(document).ready(function() {
  var modelId = window.location.pathname.substr(11, 7);
  var isCreateMode = modelId.length != 7;
  var url = dmcloud_repo_baseModelUrl;
  if(!isCreateMode)
    url = url + modelId;
  var defaultData = {
    "name": "Model Name",
    "domain": "Undefine",
    "locale": "zh"
  };
  initEditorUI(
    url, "metadata", JSON.stringify(defaultData), isCreateMode,
    function(data){
      window.location = "/ui/models/" + data._id;
    },
    function(error){}
  );
});
