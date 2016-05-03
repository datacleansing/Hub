$(document).ready(function() {

  var editor = ace.edit("dataEditor");
  editor.setTheme("ace/theme/tomorrow");
  editor.getSession().setMode("ace/mode/text");

  var resEditor = ace.edit("dataResponse");
  resEditor.setTheme("ace/theme/tomorrow");
  resEditor.getSession().setMode("ace/mode/text");

  $('#uploadBtn').
  click(function() {
    $.ajax({
          "url": $('#uploadBtn').attr('data-targetUrl'),
          "method": "POST",
          "contentType": "text/plain;charset=UTF-8",
          "data": editor.getSession().getValue()
        })
        .done(function(data) {
          resEditor.getSession().setValue(data);
        })
        .fail(function(data) {
          if(data != null && data.status == 400){
            alert("Data format error, please check your content.");
          }else {
            alert("Error, please check your config.");
          }
        });
  });
})
