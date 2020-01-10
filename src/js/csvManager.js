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
};

function checkFileName(fileName) {
    if (fileName.substring(fileName.length - 3) !== 'csv') {
        Dialogs.alert('Błąd walidacji pliku', 'Wybrany plik ma złe rozszerzenie, wybierz plik z rozszerzeniem csv');
        return false;
    }
    return true;
}

function numerationInCorrectOrder(lines) {
    let questionNumber = 1;
    for (const line of lines) {
        const currentLine = line.split(';');
        if (currentLine[0].trim().length === 0) {
            continue;
        } else if (Number(line[1]) === questionNumber) {
            questionNumber += 1;
            continue;
        } else {
            Dialogs.alert('Błąd walidacji pliku', 'Pytania są źle ponumerowane');
            return false;
        }
    }
    return true;
}

function checkQuotes(currentLine) {
    if (currentLine[0].substring(0, 1) === '"' && currentLine[currentLine.length - 2] === '"') {
        return true;
    }
    Dialogs.alert('Błąd walidacji pliku', 'Zła liczba cudzysłowów. Powinny być dwa na początku i końcu każdego pytania');
    return false;
}

function checkSemicolons(currentLine) {
    if (currentLine.length < 7) {
        Dialogs.alert('Błąd walidacji pliku', 'Pytanie ma złą ilość średników, minimalna ilość to 6');
        return false;
    }
    return true;
}

function checkQuestionType(questionType) {
    if (questionType === 'O' || questionType === 'W' || questionType === 'L') {
        return true;
    }
    Dialogs.alert('Błąd walidacji pliku', 'Pytanie ma zły typ, dozwolone typy to: O (otwarte), W (wyboru), L (liczbowe)');
    return false;
}

function checkQuestionLanguage(questionLanguage) {
    if (questionLanguage === 'PL' || questionLanguage === 'EN') {
        return true;
    }
    Dialogs.alert('Błąd walidacji pliku', 'Pytanie ma zły język, dozwolone języki to: PL lub EN');
    return false;
}

function correctNumberOfQuestionsChaaracters(question) {
    if (question.length < 250 && question.length > 0) {
        return true;
    }
    Dialogs.alert('Błąd walidacji pliku', 'Pytanie ma więcej niż 250 znaków, lub jest puste');
    return false;
}


function checkAmoutOfAnswers(answersTab, numberOfAnswers) {
    if (answersTab.length === Number(numberOfAnswers) || (numberOfAnswers === '|' && answersTab.length === 0)) {
        return true;
    }
    Dialogs.alert('Błąd walidacji pliku', 'Faktyczna ilość odpowiedzi nie równa się podanej w treści pytania.');
    return false;
}

function checkIfTitleAlreadyExists(forms, fileName) {
    for (const form of forms) {
        if (form.title === fileName) {
            Dialogs.alert(
                'Błąd walidacji pliku',
                'Formularz o takiej nazwie istnieje już w bazie danych! Zmień nazwę pliku lub wbierz inny plik.',
                () => {

                }
            );
            return false;
        }
    }
    return true;
}

function checkFormTitle(fileName) {
    const reader = new FileReader();
    let csv;
    const file = $id('import-input');
    Promise.resolve(getFormsFromDatabase())
        .then(str => {
            const forms = JSON.parse(str);
            if (!checkIfTitleAlreadyExists(forms, fileName)) return;

            const output = {
                title: fileName,
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
                if (!numerationInCorrectOrder(lines)) return;
                const result = [];
                for (const line of lines) {
                    const obj = {};
                    const currentLine = line.split(';').filter(el => (el !== ''));
                    if (currentLine[0].trim().length === 0) continue;
                    if (!checkSemicolons(currentLine) || !checkQuotes(currentLine)) return;
                    const tab = [];
                    for (let j = 0; j < currentLine.length; j++) {
                        if (j < headers.length - 1) {
                            const value =
                                currentLine[j][0] === '"'
                                    ? currentLine[j].slice(1)
                                    : currentLine[j];
                            if (headers[j] === 'type' && !checkQuestionType(currentLine[j])) return;
                            if (headers[j] === 'language' && !checkQuestionLanguage(currentLine[j])) return;
                            if (headers[j] === 'content' && !correctNumberOfQuestionsChaaracters(currentLine[j])) return;
                            obj[headers[j]] = value;
                        } else if (
                            currentLine[j].trim().length !== 0 &&
                            currentLine[j][0] !== '"'
                        ) {
                            tab.push(currentLine[j]);
                        }
                        if (j === currentLine.length - 1) {
                            if (!checkAmoutOfAnswers(tab, obj.numberOfAnswers)) return;
                            obj.answers = tab;
                        }
                    }
                    result.push(obj);
                }
                output.questions = result;
                sendFormToDatabase(output);
            };
            reader.readAsBinaryString(file.files[0]);
        });
}


exports.read = () => {
    let fileName = $id('import-input')
        .value
        .split(/(\\|\/)/g)
        .pop();
    if (checkFileName(fileName)) {
        fileName = fileName.substring(0, fileName.length - 4);
        checkFormTitle(fileName);
    }
};
