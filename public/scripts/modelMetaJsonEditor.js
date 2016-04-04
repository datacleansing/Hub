
$(document).ready(function() {
  var dataId = "1";

  var editor  = initEditor();
  formatJsonEditor(editor);

  $('#submitBtn').button().
  text("Update data").
  click(function() {
    $.post(
        '/' + dataId + "/data/raw",
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
        });
  });
});
