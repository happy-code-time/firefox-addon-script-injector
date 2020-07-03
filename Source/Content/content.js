let executedCodes = [];

browser.runtime.onMessage.addListener(request => {
    switch (request.action) {
        case 'check-addons-availablitity': {
            return Promise.resolve(true);
            break;
        };
        case 'generate-code': {
            executeCode(request.code);
            return Promise.resolve(true);
        };
        case 'get-executed-codes': {
            return Promise.resolve(executedCodes);
        };
        default: {
            break;
        };
    };
});

/**
 * Get all stored codes in the background storage
 */
let codes = [];

(async () => {
    codes = await browser.runtime.sendMessage({ action: 'get-saved-codes' }).then(response => response).catch(error => []);
})();

/**
 * Execute code
 * @param {string} code 
 * @param {string} type 
 */
const createDomNode = (code, type, attributes) => {
    type = type.toUpperCase();

    const newDomNode = document.createElement(type);
    newDomNode.innerHTML = `${code}`;

    if(attributes && attributes.length && typeof {} === typeof attributes){
        try{
            attributes.map( object => {
                const { name, value } = object;
                newDomNode.setAttribute(name, value);
            });
        }
        catch(e){
            // console.log(e);
        }
    }

    document.documentElement.appendChild(newDomNode);
};


/**
 * Handle code type signal
 * @param {object} code 
 */
const executeCode = (code) => {
    /**
     * Save executed codes for the popup window
     */
    executedCodes.push(
        {
            time: new Date(),
            code
        }
    );
    /**
     * Script injections as html
     */
    createDomNode(code.data, code.type, code.attributes);
    /**
     * Badge text
     */
    browser.runtime.sendMessage({ action: 'code-has-been-executed' }).catch( e => {});
};

/**
 * Auto code executer
 * @param {string} state 
 */
let savedTimeouts = [];

const autoExecuteCodes = (state) => {
    if (codes && codes.length) {
        codes.map(codeObject => {
            if (undefined != codeObject.runtime && codeObject.runtime.length) {

                if(codeObject.runtime){
                    if(codeObject.runtime == state){
                        return executeCode(codeObject);
                    }
                    else{
                        let timeouter = undefined;

                        switch(codeObject.runtime){
                            case 'timeout01' : {
                                timeouter = 100;
                                break;
                            }
                            case 'timeout02' : {
                                timeouter = 200;
                                break;
                            }
                            case 'timeout03' : {
                                timeouter = 300;
                                break;
                            }
                            case 'timeout04' : {
                                timeouter = 400;
                                break;
                            }
                            case 'timeout05' : {
                                timeouter = 500;
                                break;
                            }
                            case 'timeout1' : {
                                timeouter = 1000;
                                break;
                            }
                            case 'timeout2' : {
                                timeouter = 2000;
                                break;
                            }
                            case 'timeout3' : {
                                timeouter = 3000;
                                break;
                            }
                            case 'timeout4' : {
                                timeouter = 4000;
                                break;
                            }
                            case 'timeout5' : {
                                timeouter = 5000;
                                break;
                            }
                            case 'timeout10' : {
                                timeouter = 10000;
                                break;
                            }
                            case 'timeout20' : {
                                timeouter = 20000;
                                break;
                            }
                            case 'timeout30' : {
                                timeouter = 30000;
                                break;
                            }
                            case 'timeout40' : {
                                timeouter = 40000;
                                break;
                            }
                            case 'timeout50' : {
                                timeouter = 50000;
                                break;
                            }
                            case 'timeout60' : {
                                timeouter = 60000;
                                break;
                            }
                            default : {
                                timeouter = undefined;
                            }
                        }

                        if(timeouter && !savedTimeouts.includes(codeObject.uuid)){
                            savedTimeouts.push(codeObject.uuid);

                            setTimeout( () => {
                                executeCode(codeObject);
                            }, timeouter);
                        }
                    }
                }
            }
        });
    }
}
/**
 * Ready state change listener to auto execute scripts
 */
const attachReadyStateChangeListener = () => {
    window.document.addEventListener('readystatechange', function(){
        switch (document.readyState) {
            case 'loading':
                autoExecuteCodes('loading');
                break;
            case 'interactive':
                autoExecuteCodes('interactive');
                break;
            case 'complete':
                autoExecuteCodes('complete');
                break;
        }
    });
    window.addEventListener("error", function (event) {
        //console.error("script error!!", event.error);
    });
}
/**
 * Content listener for background messages
 */
try {
    let intervaller = setInterval(() => {
        if ((window !== undefined && document !== undefined && document.body !== undefined)) {
            attachReadyStateChangeListener();
            clearInterval(intervaller);
        }
    }, 10);

} catch (error) {
    //console.error(error);
};