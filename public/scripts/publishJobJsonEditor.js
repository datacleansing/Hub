
$(document).ready(function() {
  var editor  = initEditor();
  formatJsonEditor(editor);

  $('#submitBtn').button().
  text("Publish").
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
