
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
  $('#delBtn').button().
    text("DELETE ITEM").
    click(function() {
      var confirmCode = $('#delConfirmField').val();
      if(dataId != confirmCode){
        alert("Confirm code is different with current ID, please check it.")
      }
      else{
        $.ajax(
          {
            url: "/" + dataId + "/data",
            type: 'DELETE',
            success: function(result) {
                alert("Deleted");
                window.location.replace("/")
            }
        });
      }
    });
});
