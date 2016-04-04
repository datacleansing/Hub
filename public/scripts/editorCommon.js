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

function initEditorUI(updateLabel, url, defaultData, isCreateMode){
  var editor  = initEditor();
  if(defaultData){
    formatJsonEditor(editor, defaultData);
  }

  $('#submitBtn').button().
  text(updateLabel).
  click(function() {
    var foo = isCreateMode ? $.post : $.put;
    foo(
      url,
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

  if(!isCreateMode){
    $.get(
      url
    ).done(function(data){
      formatJsonEditor(editor, data)
    }).fail(function(err){
      formatJsonEditor(editor, {
        "error" : err
      })
    });
  }
}
