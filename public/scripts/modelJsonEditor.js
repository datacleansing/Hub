
$(document).ready(function() {

  var modelId = window.location.pathname.substr(11, window.location.pathname.indexOf("/editor") - 11);

  var modelDataUrl = dmcloud_repo_baseModelUrl + "" + modelId + "/content";
  //formatJsonEditor(editor);

  var editor  = initEditor();
  $('#submitBtn').button().
  text("Update Model Data").
  click(function() {
    $.put(
      modelDataUrl,
      {
        data: editor.getSession().getValue()
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
    formatJsonEditor(editor, JSON.stringify(data))
  }).fail(function(err){
    formatJsonEditor(editor, {
      "error" : err
    })
  })
});
