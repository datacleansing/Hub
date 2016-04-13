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
    var o = JSON.stringify(JSON.parse(val), null, 4);
    editor.getSession().setValue(o);
  }
}

function initEditorUI(
    updateLabel,
    url,
    dataField,
    defaultData,
    isCreateMode,
    dataUpdateSuccessCallback,
    dataUpdateErrorCallback){
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
    var method = isCreateMode === true ? "post" : "put";
    var payload = {};
    payload[dataField] = editor.getSession().getValue();
    $.ajax(url, {
      "method": method,
      "data": payload
      })
      .done(function(data) {
          console.log("Date has been updated");
          if(typeof dataUpdateSuccessCallback == 'function'){
            dataUpdateSuccessCallback(data);
          }
      })
      .fail(function(error) {
        if(error != null && error.status == 400){
          console.log("Data format error, please check your content.");
        }else {
          console.log(JSON.stringify(error));
          if(typeof dataUpdateSuccessCallback == 'function'){
            dataUpdateErrorCallback(error);
          }
        }
      }
    );
  });
}
