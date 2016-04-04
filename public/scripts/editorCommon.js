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
    var o = JSON.parse(val);
    val = JSON.stringify(o, null, 4);
    editor.getSession().setValue(val);
  }
}
