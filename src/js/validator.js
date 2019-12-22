const Validate = {
    validResult: { validated: true, warnings: [] },

    validateForm(form) {
        this.validResult = { validated: true, warnings: [] };
        if (form.title.length < 1 || form.title.length > 250)
            this.updateResult('tutuł nie może mieć mniej niż 1 znaku oraz więcej niż 250');
        if (form.questions.length < 1)
            this.updateResult('liczba pytań nie może być mniejsza od 1 ');
        for (const question in form.questions.entries()) {
            if (Object.prototype.hasOwnProperty.call(form.questions, question)) {
                if (question.type !== 'O' || question.type !== 'W' || question.type !== 'L')
                    this.updateResult(`niepoprawny typ pytania numer ${question.number}`);
                if (question.language !== 'EN' || question.language !== 'PL')
                    this.updateResult(`niepoprawny język pytania numer ${question.number}`);
                if (question.content.length < 1 || question.content.length > 250)
                    this.updateResult(`zawartość pytania numer ${question.number} nie może być mniejsza niż 1 oraz więcej niż 250`);
                if (question.type === 'W' && question.answers.length < 1)
                    this.updateResult('pytania zamknięte nie mogą mieć mniej niż 2 odpowiedzi');
                if (question.type === 'W') {
                    for (const answer in question.answers) {
                        if (answer.length < 1 || answer.length > 250)
                            this.updateResult(`odpowiedz pytania zamknietego o numerze ${question.number} nie może mieć mniej niż 1 znak oraz więcej niż 250`);
                    }
                }
            }
        }
        return this.validResult;
    },
    validateFilledForm(filledForm) {
        this.validResult = { validated: true, warnings: [] };
        if (filledForm.owner.length < 1)
            this.updateResult('błąd podczas odczytywania nazwy użytkownika');
        for (const question in filledForm.questions.entries()) {
            if (Object.prototype.hasOwnProperty.call(filledForm.questions, question)) {
                if (question.userAnswer.length < 1 || question.userAnswer.length > 250)
                    this.updateResult(`odpowiedz pytania zamknietego o numerze ${question.number} nie może mieć mniej niż 1 znak oraz więcej niż 250`);
            }
        }
        return this.validResult;
    },
    updateResult(warning) {
        this.validResult.validated = false;
        this.validResult.warnings.push(warning);
    }


};

exports.Validate = Validate;
