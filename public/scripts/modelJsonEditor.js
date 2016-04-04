
$(document).ready(function() {
  var modelId = window.location.pathname.substr(11, window.location.pathname.indexOf("/editor") - 11);
  var url = dmcloud_repo_baseModelUrl + "" + modelId + "/content";
  initEditorUI("Update Model Data", url);
});
