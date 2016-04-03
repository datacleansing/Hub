function initEditor(sId){
    var sId = sId ? sId : "editor"
    var editor = ace.edit(sId);
    editor.setTheme("ace/theme/tomorrow");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setFoldStyle("markbeginend");
    return editor;
}

function formatJsonEditor(editor){
    var val = editor.getSession().getValue()
    var o = JSON.parse(val)
    val = JSON.stringify(o, null, 4)
    editor.getSession().setValue(val)
}
