$(document).ready(function() {

  var editor = ace.edit("dataEditor");
  editor.setTheme("ace/theme/tomorrow");
  editor.getSession().setMode("ace/mode/text");

  $('#uploadBtn').
  click(function() {
    $.ajax({
          "url": $('#uploadBtn').attr('data-targetUrl'),
          "method": "PUT",
          "contentType": "text/plain;charset=UTF-8",
          "data": editor.getSession().getValue()
        })
        .done(function(data) {
          $.ajax({
              "url": $('#uploadBtn').attr('data-tagUrl'),
              "method": "PUT",
              "contentType": "application/json;charset=UTF-8",
              "data": JSON.stringify(data)
            })
            .done(function(data) {
              window.location = $('#uploadBtn').attr('data-successUrl');
            });
        })
        .fail(function(data) {
          if(data != null && data.status == 400){
            alert("Data format error, please check your content.");
          }else {

          }
        });
  });
})
