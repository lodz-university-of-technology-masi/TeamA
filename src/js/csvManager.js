function $id(id) {
  return document.getElementById(id);
}

exports.read = function() {
  let reader = new FileReader();
  let csv;
  let file = $id("import-input");
  let output = {
    "title" : $id("import-input").value.split(/(\\|\/)/g).pop(),
    "form" : [],
  };

  reader.onload = function() {
    csv = reader.result;
    let headers = [
      "number",
      "type",
      "language",
      "content",
      "numberOfAnswers",
      "answers"
    ];
    let lines = csv.split("\n");
    let result = [];
    for (let line of lines) {
      let obj = {};
      let currentLine = line.split(";");
      if (currentLine[0].trim().length === 0) continue;
      let tab = [];
      for (let j = 0; j < currentLine.length; j++) {
        if (j < headers.length) {
          let value =
            currentLine[j][0] === '"'
              ? currentLine[j].slice(1)
              : currentLine[j];
          obj[headers[j]] = value;
        } else {
          if (currentLine[j].trim().length !== 0 && currentLine[j][0] !== '"') {
            tab.push(currentLine[j]);
          }
        }
        if (j === currentLine.length - 1) {
          obj.answer = tab;
        }
      }
      result.push(obj);
    }
    output["form"] = result;
    console.log (JSON.stringify(output));
    }
  reader.readAsBinaryString(file.files[0]);
  //#TODO send output to lambda
};

exports.save = function(){
  

}