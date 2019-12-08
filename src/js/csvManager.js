const { sendFormToDatabase } = require('./databaseConnector');
const { getFormsFromDatabase } = require('./databaseConnector');
const { $id } = require('./utils');
const Dialogs = require('./common/dialogs');

exports.saveCsv = data => {
    let readForm = [];
    let readAnswers = [];
    let csvOutput = '';
    readForm = data.questions;
    for (let i = 0; i < readForm.length; i++) {
        let csvStringOneLine = '';
        csvStringOneLine =
      `"${
          readForm[i].number
      };${
          readForm[i].type
      };${
          readForm[i].language
      };${
          readForm[i].content
      };${
          readForm[i].numberOfAnswers
      };`;
        readAnswers = readForm[i].answers;
        for (let j = 0; j < readAnswers.length; j++) {
            csvStringOneLine += `${readAnswers[j]};`;
        }
        csvOutput += `${csvStringOneLine}" \r\n`;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += csvOutput;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${readForm.title}.csv`);
    document.body.appendChild(link);
    link.click();
}
function checkFormTitle(filename) {
    const reader = new FileReader();
    let csv;
    const file = $id('import-input');
    Promise.resolve(getFormsFromDatabase()).then(str => {
        const forms = JSON.parse(str);
        for (const [_, form] of forms.entries()) {
            if (form.title == filename) {
                Dialogs.alert(
                    'Błąd',
                    'Formularz o takiej nazwie istnieje już w bazie danych! Zmień nazwę pliku lub wbierz inny plik.',
                    () => {

                    }
                );
                return;
            }
        }

        const output = {
            title: filename,
            questions: []
        };

        reader.onload = () => {
            csv = reader.result;
            const headers = [
                'number',
                'type',
                'language',
                'content',
                'numberOfAnswers',
                'answers'
            ];
            const lines = csv.split('\n');
            const result = [];
            for (const line of lines) {
                const obj = {};
                const currentLine = line.split(';');
                if (currentLine[0].trim().length === 0) continue;
                const tab = [];
                for (let j = 0; j < currentLine.length; j++) {
                    if (j < headers.length - 1) {
                        const value =
              currentLine[j][0] === '"'
                  ? currentLine[j].slice(1)
                  : currentLine[j];
                        obj[headers[j]] = value;
                    } else if (
                        currentLine[j].trim().length !== 0 &&
              currentLine[j][0] !== '"'
                    ) {
                        tab.push(currentLine[j]);
                    }
                    if (j === currentLine.length - 1) {
                        obj.answers = tab;
                    }
                }
                result.push(obj);
            }
            output.questions = result;
            sendFormToDatabase(output);
            Dialogs.alert(
                'Dodano do bazy danych',
                'Twój formularz został dodany do bazy danych, możesz go teraz zobaczyć w oknie: "Zobacz szablony formularzy".',
                () => {
                }
            );
        };
        reader.readAsBinaryString(file.files[0]);
    });
}

exports.read = () => {
    let filename = $id('import-input')
        .value.split(/(\\|\/)/g)
        .pop();
    filename = filename.substring(0, filename.length - 4);
    checkFormTitle(filename);
};
