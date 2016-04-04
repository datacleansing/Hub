
$(document).ready(function() {

  var modelId = window.location.pathname.substr(1, window.location.pathname.indexOf("/editor") - 1);

  var modelDataUrl = dmcloud_repo_baseModelUrl + "" + modelId + "/content";
  //formatJsonEditor(editor);

  var editor  = initEditor();
  $('#submitBtn').button().
  text("Update Model Data").
  click(function() {
    $.put(
      modelDataUrl,
      {
        raw: editor.getSession().getValue()
      })
      .done(function(data) {
          alert("Date has been updated");
      })
      .fail(function(data) {
        if(data != null && data.status == 400){
          alert("Data format error, please check your content.");
        }else {
          alert(JSON.stringify(data));
        }
      }
    );
  });

  $.get(
    modelDataUrl
  ).done(function(data){

  }).fail(function(data){

  })
});
