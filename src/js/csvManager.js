const { sendFormToDatabase } = require("./databaseConnector");
const { getFormsFromDatabase } = require("./databaseConnector");
const { $id } = require("./utils");
const Dialogs = require("./common/dialogs");

exports.saveCsv = function(data) {
  let readForm = [];
  let readAnswers = [];
  let csvOutput = "";
  readForm = data.questions;
  for (let i = 0; i < readForm.length; i++) {
    let csvStringOneLine = "";
    csvStringOneLine =
      '"' +
      readForm[i].number +
      ";" +
      readForm[i].type +
      ";" +
      readForm[i].language +
      ";" +
      readForm[i].content +
      ";" +
      readForm[i].numberOfAnswers +
      ";";
    readAnswers = readForm[i].answers;
    for (let j = 0; j < readAnswers.length; j++) {
      csvStringOneLine += readAnswers[j] + ";";
    }
    csvOutput += csvStringOneLine + '";;;;;;' + "\r\n";
  }
  console.log(csvOutput);

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += csvOutput;
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", answer.title + ".csv");
  document.body.appendChild(link);
  link.click();
};

function checkFormTitle(title) {
  getFormsFromDatabase().then(str => {
    const forms = JSON.parse(str);
    forms.forEach(function (form) {
      if (form.title == title) {
        console.log("duplicated titles");
        return true;
      }
    });
    return false;
  });
  //#todo sprawdzenie czy nie ma juz takiego tytuulu w bazie danych
}

exports.read = function () {
  let reader = new FileReader();
  let csv;
  let file = $id("import-input");
  let filename = $id("import-input")
    .value.split(/(\\|\/)/g)
    .pop();
filename = filename.substring(0, filename.length - 4);
console.log(checkFormTitle(filename));
  if (checkFormTitle(filename)) {
    
    console.log("jestem ale zle ze jestem");
    let output = {
      title: filename,
      questions: [],
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
            if (
              currentLine[j].trim().length !== 0 &&
              currentLine[j][0] !== '"'
            ) {
              tab.push(currentLine[j]);
            }
          }
          if (j === currentLine.length - 1) {
            obj.answers = tab;
          }
        }
        result.push(obj);
      }
      output["questions"] = result;
      // console.log(JSON.stringify(output));
      //send output to lambda
      // sendFormToDatabase(output);
    };
    reader.readAsBinaryString(file.files[0]);
  }
  else {
    Dialogs.confirm(
      "Błąd",
      "Formularz o takiej nazwie istnieje już w bazie danych! Zmień nazwę pliku lub wbierz inny plik.",
      () => {
        // Tutaj się zgodziliśmy
      }
    );
  }
};
