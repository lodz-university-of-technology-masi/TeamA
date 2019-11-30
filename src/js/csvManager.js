function $id(id) {
  return document.getElementById(id);
}

function saveCsv(data) {
  let answer = [];
  let readForm = [];
  let readAnswers = [];
  let csvOutput = '';
  answer = JSON.parse(data);
  readForm = answer.form;
  for (let i = 0; i < readForm.length; i++) {
    let csvStringOneLine = '';
    csvStringOneLine = '\"'
      + readForm[i].number + ";"
      + readForm[i].type + ";"
      + readForm[i].language + ";"
      + readForm[i].content + ';'
      + readForm[i].numberOfAnswers + ';';
    readAnswers = readForm[i].answers;
    for (let j = 0; j < readAnswers.length; j++) {
      csvStringOneLine += readAnswers[j] + ";";
    }
    csvOutput += csvStringOneLine +  '";;;;;;' + '\r\n';
  }
  console.log(csvOutput);

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += csvOutput;
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", answer.title + '.csv');
  document.body.appendChild(link);
  // link.click();
}

exports.read = function() {
  let reader = new FileReader();
  let csv;
  let file = $id("import-input");
  let filename = $id("import-input").value.split(/(\\|\/)/g).pop().substring();

  let output = {
    title:filename.substring(0, filename.length - 4),
    form: [],
  };

  reader.onload = function() {
    csv = reader.result;
    let headers = [
      "number",
      "type",
      "language",
      "content",
      "numberOfAnswers",
      "answers",
    ];
    let lines = csv.split("\n");
    let result = [];
    for (let line of lines) {
      let obj = {};
      let currentLine = line.split(";");
      if (currentLine[0].trim().length === 0) continue;
      let tab = [];
      for (let j = 0; j < currentLine.length; j++) {
        if (j < headers.length - 1) {
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
          obj.answers = tab;
        }
      }
      result.push(obj);
    }
    output["form"] = result;
    console.log(JSON.stringify(output));
    saveCsv(JSON.stringify(output));
  };
  reader.readAsBinaryString(file.files[0]);
  //#TODO send output to lambda
};

exports.save = function() {};
