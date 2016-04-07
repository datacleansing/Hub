function initEditor(sId){
  var sId = sId ? sId : "editor"
  var editor = ace.edit(sId);
  editor.setTheme("ace/theme/tomorrow");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setFoldStyle("markbeginend");
  return editor;
}

function formatJsonEditor(editor, val){
  if(val){
    var o = JSON.stringify(val, null, 4);
    editor.getSession().setValue(o);
  }
}

function initEditorUI(updateLabel, url, dataField, defaultData, isCreateMode){
  var editor  = initEditor();
  var initValue = editor.getSession().getValue();
  if(initValue){
    formatJsonEditor(editor, initValue);
  }else if(defaultData){
    formatJsonEditor(editor, defaultData);
  }
  var dataField = dataField ? dataField : "data";

  $('#submitBtn').button().
  text(updateLabel).
  click(function() {
    var method = isCreateMode ? "post" : "put";
    var payload = {};
    payload[dataField] = editor.getSession().getValue();
    $.ajax(url, {
      "method": method,
      "data": payload
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
}
