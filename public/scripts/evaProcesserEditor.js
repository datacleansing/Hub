/**
*
*/

function startRead() {
	var file = document.getElementById('file').files[0];
	if(file){
		getAsText(file);
	}
}

function getAsText(readFile) {

	var reader = new FileReader();

	// Handle progress, success, and errors
	reader.onprogress = updateProgress;
	reader.onload = loaded;
	reader.onerror = errorHandler;

	// Read file into memory as UTF-8
	reader.readAsText(readFile, "UTF-8");
}

function updateProgress(evt) {
	if (evt.lengthComputable) {
		// evt.loaded and evt.total are ProgressEvent properties
		var loaded = (evt.loaded / evt.total);
		console.log(loaded)
	}
}

function loaded(evt) {
	// Obtain the read file data
	var fileString = evt.target.result;
	var section  = 'header';
	var attrs = [];
	var name = null;
	var description = null;
	fileString.split("\n").forEach(function(line, index, array)
	{
		var chunks = line.trim().split(/[\s]+/);

		// skip blank lines and comments
		if (chunks.length === 1 && chunks[0] === '') {
			return;
		}
		else if (/^%/.test(chunks[0])) {
			return;
		}
		// relation name
		else if (/^@RELATION/i.test(chunks[0])) {
		if (section !== 'header') {
			console.log(new Error('@RELATION found outside of header'));
			return;
		}
		name = chunks[1];
		}
		// attribute spec
		else if (/^@ATTRIBUTE/i.test(chunks[0])) {
		if (section != 'header') {
			console.log( new Error('@ATTRIBUTE found outside of header section'));
			return;
		}
		var name = chunks[1].replace(/['"]|:$/g, '');
		var type = parseAttributeType(chunks.slice(2).join(' '));
		attrs.push({
				"name": name,
				"type": type,
				"data": []
		});
		}
		else if (/^@DATA/i.test(chunks[0])) {
			if (section == 'data') {
					console.log( new Error('@DATA found after DATA'));
					return;
			}
			section = 'data';
		}
		else {
			if (section == 'data') {
				var datas = chunks.join('').replace(/['"]/g, '').split(',');
				for (var i = 0; i < datas.length; i++) {
					attrs[i].data.push(datas[i]);
				}
			}
			else{
				description += line + "\n";
			}
		}
	});
	evaData = {
		"name" : name,
		"description": description,
		"attrs": attrs
	}
}

var evaData = null;

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
	// The file could not be read
	}
}

/*
* Types can be any of:
*  - numeric | integer | real | continuous
*  - string
*  - date [format]
*  - nominal
*/
function parseAttributeType(type) {
	var finaltype = { type: type };
	var parts;

	if (/^date/i.test(type)) {
		parts = type.split(/[\s]+/);
		var format = "yyyy-MM-dd'T'HH:mm:ss";
		if (parts.length > 1) {
			format = parts[1];
		}
		finaltype = {
			type: 'date',
			format: format
		}
	}
	else if (parts=type.match(/^{([^}]*)}$/)) {
		finaltype.type = 'nominal';
		finaltype.oneof = parts[1].replace(/[\s'"]/g, '').split(/,/);
	}
	else if (/^numeric|^integer|^real|^continuous/i.test(type)) {
		finaltype.type = 'numeric';
	}
	else if (/string/i.test(type)) {
		finaltype.type = 'string';
	}

	return finaltype;
}

$(document).ready(function() {

	$('#loadBtn').button().
		text("Load Data").
		click(function() {
			startRead();
			$('#dataPreview').text(JSON.stringify(evaData));
		});


	$('#launchBtn').button().
		text("Launch Evaluation").
		click(function() {
			$.post(
				"http://localhost:12617/evaluator/processer/repo/1",
				JSON.stringify(evaData),
				function(response){
					alert(JSON.stringify(response));
				})
		});
});
