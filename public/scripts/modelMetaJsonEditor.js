
$(document).ready(function() {
  var modelId = window.location.pathname.substr(11, 7);
  var isCreateMode = modelId.length == 0;
  var url = dmcloud_repo_baseModelUrl;
  if(!isCreateMode)
    url = url + modelId;
  var label = isCreateMode ? "Create Model" : "Update Model Metadata";
  var defaultData = {
    "name": "Model Name",
    "domain": "Undefine",
    "locale": "zh"
  };
  initEditorUI(
    label, url, "metadata", JSON.stringify(defaultData), isCreateMode,
    function(data){
      window.location = "/ui/models/" + modelId;
    },
    function(error){}
  );
});
