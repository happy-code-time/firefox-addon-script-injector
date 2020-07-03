const setLanguage = (language: string = 'en') => {

    switch(language){
        case 'Deutsch' :
        case 'de' : {
            language = 'de';
            break;
        }
        case 'English' :
        case 'en' : {
            language = 'en';
            break;
        }
        case 'Polski' :
        case 'pl' : {
            language = 'pl';
            break;
        }
        default: {
            language = 'en';
        }
    }

    localStorage.setItem('applanguage', language);
}

export default setLanguage;